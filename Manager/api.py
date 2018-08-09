from django.db.utils import IntegrityError
from django.db.models import Q, Sum

from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, exceptions, permissions, viewsets, mixins
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import BasePermission, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from .serializer import *
from .models import *
from . import tasks
from . import payments
from django.conf import settings
from Manager.models import UserBase
from django.core.mail import send_mail, EmailMessage
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from datetime import datetime, timedelta, date
import hashlib
import fpformat
import json
from pprint import pprint
from django.forms.models import model_to_dict
import requests
import pprint
import fpformat
from requests_futures.sessions import FuturesSession
from PIL import Image, ImageOps
import os
import csv
'''
User API:
'''
# Create by user

try:
    settingbar = SettingBar.objects.get(id=1)
except Exception as e:
    print e
    pass


class IsAuthenticated(BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_robot==False

class IsRobot(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.is_robot==True

class IsSuperAdmin(IsAdminUser):

    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.is_superuser

class IsOpenTheBar(IsAdminUser):
    message = 'BAR IS CLOSED AT THIS TIME'

    def has_permission(self, request, view):
        settingbar = SettingBar.objects.get(id=1)
        return settingbar.bar_status or request.user.is_superuser or request.user.is_robot==True

class UserSignUp(generics.CreateAPIView):
    serializer_class = UserSignupSerializer

    def post(self, request, format=None):
        fb_token = request.data.get('fb_token')
        gp_token = request.data.get('gp_token')
        user = None
        try:
            if fb_token or gp_token:
                # TODO can be dangerous here?!? (send a FB token w/o email and force use any other email)
                if fb_token:
                    user = UserBase.get_or_create_user_from_facebook(fb_token)
                if not user:
                    raise api_utils.BadRequest('UNABLE_TO_LOGIN')
            else:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                user = serializer.create(serializer.validated_data)
            if user.is_email_verified:
                serializer = UserWithTokenSerializer(user)
            else:
                push_data = {'email':user.email}
                session = FuturesSession()
                future = session.post(settings.SITE_URL + reverse('user-send-verify-email'), data=push_data)
                # grequests.post(settings.SITE_URL + reverse('user-send-verify-email'), data=push_data)
                serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            raise ValidationError({'email': str(e[1])})

# Create by admin
class UserList(generics.ListCreateAPIView):
    queryset = UserBase.objects.all()
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer

    def get_queryset(self):
        ret = self.queryset
        search = self.request.GET.get('search', False)
        if search:
            ret = self.queryset.filter(Q(username__icontains=search)|\
                Q(email__icontains=search)|Q(id__icontains=search)|\
                Q(first_name__icontains=search)|Q(last_name__icontains=search))
        return ret


# User login and get their profile
class UserProfile(generics.GenericAPIView):
    serializer_class = UserWithTokenSerializer

    def post(self, request, format=None):
        fb_token = request.data.get('fb_token')
        # gp_token = request.data.get('gp_token')
        email = request.data.get('email')
        password = request.data.get('password')

        user = None

        if request.user.is_authenticated():
            user = request.user
        elif fb_token:
            user = UserBase.get_or_create_user_from_facebook(fb_token, should_create=False)
        # elif gp_token:
        #     user = UserBase.get_or_create_user_from_googleplus(gp_token, should_create=False)
        elif email and password:
            user = authenticate(username=email, password=password)
        if not user:
            raise api_utils.BadRequest("INVALID_PROFILE")

        # if request.session.get('_auth_user_id', 0) != user.id:
        #     # create logged in session for the user if not available
        #     utils.login_user(request, user)
        if type(user) == UserBase:
            if not user.is_email_verified:
                raise api_utils.BadRequest("EMAIL_WAS_NOT_VERIFIED")
            user.last_login = datetime.now()
            user.save()
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        raise api_utils.BadRequest("INVALID_PROFILE")
class UserCloseApps(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request,format=None):
        log = UserLog(user=request.user,status=UserLog.CONST_STATUS_CLOSE)
        last_login = UserLog.objects.filter(creation_date__date=date.today(),status=UserLog.CONST_STATUS_OPEN).last()
        if last_login:
            log.how_long = (log.creation_date - last_login.creation_date).minutes
            log.save()

# Admin see detail user, user update, delete
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    queryset = UserBase
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        try:
            order = self.request.GET.get('order', False)
            if order:
                return UserWithOrderSerializer
        except Exception as e:
            pass
        return self.serializer_class

class UserChangePassword(APIView):

    def post(self,request,format=None):
        old_password = request.data.get('old_password', None)
        if not old_password:
            raise api_utils.BadRequest("INVALID_CURRENT_PASSWORD")
        else:
            if authenticate(username=request.user.username, password=old_password):
                try:   
                    new_password = request.data.get('new_password', None)     
                    if not new_password:
                        raise api_utils.BadRequest("INVALID_NEW_PASSWORD")
                    request.user.set_password(new_password) 
                    request.user.save()
                except Exception as e:
                    raise api_utils.BadRequest(e)
            else:
                raise api_utils.BadRequest("INVALID_CURRENT_PASSWORD")
        return Response({'detail':'Password has been changed!'},status=status.HTTP_200_OK)


class UserForgetPassword(APIView):
    datetime_format = '%Y%m%d%H%M%S'

    def get_reset_code(self, email, expired_time=None):
        if not expired_time:
            expired_time = (datetime.now() + timedelta(minutes=5)).strftime(self.datetime_format)
        code = ''.join([email, settings.SECRET_KEY, expired_time])
        return ''.join([hashlib.sha1(code).hexdigest().upper()[-8:], expired_time])

    def post(self, request, format=None):
        reset_code = request.data.get('code', None)
        email = self.request.data.get('email')
        user = UserBase.objects.filter(email=email).first()
        if not reset_code:
            if user:
                user.opt = self.get_reset_code(email)
                user.save()
                reset_code = user.opt[:8]
                subject = 'Hi-Effeciency - Reset password requested'
                html_content = render_to_string('email/password_reset.html', {'user':user.full_name, 'reset_code':reset_code})
                tasks.send_email(subject, html_content, [email],'ForgotPassword@HiEfficiencyBar.com')
            else:
                raise api_utils.BadRequest('EMAIL_NOT_EXISTS')

            return Response({'message': 'A code for verify was sent to your email. '
                            , 'success': True}, status=status.HTTP_200_OK)
        else:
            password = self.request.data.get('password')
            if not password:
                raise api_utils.BadRequest('NEW_PASSWORD_MISSING')
            if not user:
                raise api_utils.BadRequest('INVALID_USER')
            try:
                code = user.opt[:8]
                expired_time = user.opt[8:]
                print (expired_time)
                if reset_code != code:
                    raise api_utils.BadRequest('INVALID_RESET_CODE')
            except:
                raise api_utils.BadRequest('INVALID_RESET_CODE')

            if datetime.now().strftime(self.datetime_format) > expired_time:
                raise api_utils.BadRequest('RESET_CODE_EXPIRED')

            user.set_password(password)
            user.save()

            return Response({'message': 'Password reset is successful.', 'success': True})

        return Response({
            'error': 'Error! Can\'t start forget password process',
            'success': False
        }, status=status.HTTP_400_BAD_REQUEST)

class SendVerificationEmail(APIView):

    def get_verification_code(self, user):
        code = '{}++{}++{}'.format(settings.SECRET_KEY, user.id, user.email)
        return '{}_{}'.format(hashlib.sha1(code).hexdigest(),user.id)

    def post(self, request, format=None):
        email = self.request.data.get('email')
        user = UserBase.objects.filter(email=email).first()
        if not user:
            return Response({
                'error': 'Error! Can\'t start email verification process',
            }, status=status.HTTP_400_BAD_REQUEST)

        verification_link = settings.SITE_URL +reverse('user-verify-email')+'?code={}'.format(self.get_verification_code(user))

        subject = 'Hi-Efficiency - Validate your account first'
        html_content = render_to_string('email/verify_email.html', {'verification_link':verification_link})
        tasks.send_email(subject, html_content, [user.email], 'Verification@HiEfficiencyBar.com')

        return Response({'message': 'An email was sent to your email. '
                                    'Please click on the link in it to verify your email address.'},status=status.HTTP_202_ACCEPTED)
class UserFavoriteDrink(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        fav = self.request.user.favorite_drink.filter(id=pk).first()
        if fav:
            self.request.user.favorite_drink.remove(fav)
            return Response({'detail':'deleted'},status=status.HTTP_202_ACCEPTED)
        try:
            self.request.user.favorite_drink.add(Drink.objects.get(id=pk))
        except:
            raise api_utils.BadRequest("INVALID_DRINK")
        return Response({'detail':'added'},status=status.HTTP_202_ACCEPTED)


class AddToTab(generics.CreateAPIView):
    permission_classes = [IsAuthenticated, IsOpenTheBar]
    serializer_class = AddToTabSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user']=request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class MyTab(generics.ListAPIView):
    queryset = Tab
    permission_classes = [IsAuthenticated, IsOpenTheBar]
    serializer_class = OrderTabSerializer

    def get_serializer_class(self):
        pending = self.request.GET.get('pending', False)
        if pending:
            return TabSerializer
        return OrderTabSerializer

    def get_queryset(self):
        pending = self.request.GET.get('pending', False)
        if pending:
            return Tab.objects.filter(order__isnull=True)
        return Tab.objects.filter(user=self.request.user, order__isnull=True)

class UpdateTab(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tab
    permission_classes = [IsAuthenticated]
    serializer_class = OrderTabSerializer

    def perform_update(self, serializer):
        addToTabSerializer =  AddToTabSerializer()
        if not addToTabSerializer.check_available(tab=instance, quantity=serializer.validated_data['quantity']):
            raise api_utils.BadRequest("NOT ENOUGH INGREDIENT FOR ADD MORE QUANTITY")
        serializer.save()

    def delete(self, request, *args, **kwargs):
        try:
            tab = Tab.objects.get(id=kwargs['pk'])
            if not tab.drink.creator.is_superuser:
                tab.drink.delete()
        except Exception as e:
            raise api_utils.BadRequest("Not found")
        self.destroy(request, *args, **kwargs)
        return Response({'detail':'success'},status=status.HTTP_200_OK)

class UserOrder(generics.ListCreateAPIView):
    queryset = Order.objects.order_by('-creation_date')
    permission_classes = [permissions.IsAuthenticated, IsOpenTheBar]
    # serializer_class = OrderSerializer

    def get_serializer_class(self):
        try:
            is_robot = self.request.GET.get('robot', False)
            if is_robot or self.request.user.is_robot==True:
                return OrderMachineSerializer
            current = self.request.GET.get('current', None)
            if current:
                return OrderMachineSerializer
        except Exception as e:
            pass
        
        return OrderSerializer

    def get_queryset(self):
        is_robot = self.request.GET.get('robot', False)
        if is_robot or self.request.user.is_robot==True:
            return self.queryset.exclude(status=Order.STATUS_TOOK).order_by('priority')

        is_admin = self.request.GET.get('admin', False)
        if not is_admin:
            # user order history
            ret = self.queryset.filter(user=self.request.user)
            current = self.request.GET.get('current', None)
            if current:
                ret = ret.exclude(status__gte=Order.STATUS_FINISHED).order_by('creation_date').first()
                if ret:
                    ret = Order.objects.filter(id=ret.id)
            return ret

        ret = self.queryset.all()        
        search = self.request.GET.get('search', None)
        if search:
            ret = ret.filter(Q(user__username__icontains=search)|\
                Q(user__email__icontains=search)|Q(id__icontains=search))
        
        status = self.request.GET.get('status', None)
        if status:
            ret = ret.filter(status=status)


        return ret

    def create(self, request, *args, **kwargs):
        reorder_id = self.request.data.get('order_id', None)
        tab_id = self.request.data.get('tab_id', None)
        reorder = None
    
        if reorder_id:
            try:
                reorder = Order.objects.get(id=reorder_id, user=request.user)
            except Exception as e:
                raise api_utils.BadRequest("INVALID_ORDER_ID")
            tabs = reorder.products.all()
            ret = {}
            ret['block_count'] =0
            ret['block_drinks'] = []
            for tab in tabs:
                if tab.drink.status==Ingredient.CONST_STATUS_BLOCKED:
                    ret['block_count'] += 1
                    ret['block_drinks'].append(tab.drink.name)
                    continue
                garnishes = tab.garnishes.all()
                tab_current = Tab.objects.filter(drink=tab.drink, user=request.user, order__isnull=True)
                if not tab_current:
                    new_tab = tab
                    new_tab.pk = None
                    new_tab.order = None
                    new_tab.status=Tab.STATUS_NEW
                    new_tab.quantity_done=0
                    new_tab.save()
                    new_tab.garnishes.add(*garnishes)
                else:
                    tab_current = tab_current.first()
                    tab_current.quantity +=1
                    tab_current.save()
            # ret['block_drinks'] = DrinkSerializer(Drink.objects.filter(id__in=ret['block_drinks'])).data
            return Response(ret, status=status.HTTP_200_OK)

        if tab_id:
            ret = {}
            ret['block_count'] =0
            ret['block_drinks'] = []
            try:
                tab = Tab.objects.get(id=tab_id, user=request.user)
                if tab.drink.status==Ingredient.CONST_STATUS_BLOCKED:
                    ret['block_count'] = 1
                    ret['block_drinks'].append(tab.drink.name)
                    return Response(ret, status=status.HTTP_200_OK)
                garnishes = tab.garnishes.all()
                tab_current = Tab.objects.filter(drink=tab.drink, user=request.user, order__isnull=True)
                if not tab_current:
                    new_tab = tab
                    new_tab.pk = None
                    new_tab.order = None
                    new_tab.status=Tab.STATUS_NEW
                    new_tab.quantity_done=0
                    new_tab.save()
                    new_tab.garnishes.add(*garnishes)
                else:
                    tab_current = tab_current.first()
                    tab_current.quantity +=1
                    tab_current.save()
            except Exception as e:
                print e
                raise api_utils.BadRequest("INVALID_DRINK_ID")
            return Response(ret, status=status.HTTP_200_OK)
            
        tabs = request.user.tab.filter(order__isnull=True, quantity__gt=0, drink__status=Drink.CONST_STATUS_ENABLED)
        stripe_token = self.request.data.get('stripe_token', None)
        if not stripe_token:
            raise api_utils.BadRequest("INVALID_STRIPE_TOKEN")

        # Get data for new order
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['user']=request.user

        # Check out tab for new order
        if not tabs:
            raise api_utils.BadRequest("YOU HAVE NOT ADDED TO TAB ANY THING")
        temp = tabs.aggregate(sum_quantity=Sum('quantity'))
        if temp['sum_quantity'] > settingbar.max_drink_order:
            raise api_utils.BadRequest("OVER {} QUANTITY, PLEASE REMOVE SOME!".format(settingbar.max_drink_order))
        total_bill = 0
        robot_will_do = None
        for robot in Robot.objects.all():
            total_bill = 0
            temp = 0
            for tab in tabs:
                if tab.drink.is_enough_ingredient(robot,tab.quantity):
                    temp +=1
                    tab.amount = int(tab.quantity)*float(tab.drink.price)
                    tab.save()
                    total_bill += int(tab.quantity)*float(tab.drink.price)
                else:
                    if tab.quantity==1:
                        tab.drink.status = Drink.CONST_STATUS_BLOCKED
                        tab.drink.save()
                        raise api_utils.BadRequest("NOT ENOUGH INGREDIENT FOR {}, WE WILL REMOVE THEM".format(tab.drink.name.upper()))
                    else:
                        # Check if still enough for 1 cup
                        if not tab.drink.is_enough_ingredient(robot,1):
                            tab.drink.status = Drink.CONST_STATUS_BLOCKED
                            tab.drink.save()
                            raise api_utils.BadRequest("NOT ENOUGH INGREDIENT FOR {}, WE WILL REMOVE THEM".format(tab.drink.name.upper()))
                        else:
                            raise api_utils.BadRequest("JUST ENOUGH INGREDIENT FOR 1 CUP {}".format(tab.drink.name.upper()))
                    break
            if temp == len(tabs):
                robot_will_do = robot
                break

        if not robot_will_do:
            raise api_utils.BadRequest("NOT ENOUGH INGREDIENT FOR DRINK, PLEASE BACK LATER")
        serializer.validated_data['robot']=robot_will_do

        total_bill = fpformat.fix(total_bill, 2)
        total_bill = float(total_bill)

        serializer.validated_data['amount_without_fee'] = float(total_bill)
        # Add fee and tax
        if total_bill>0:
            if settingbar.fee_unit==SettingBar.CONST_FEE_DOLLAR:
                total_fee=settingbar.fee
            else:
                total_fee=float(total_bill*settingbar.fee/SettingBar.CONST_FEE_PERCENT)
            total_bill += float(total_bill*settingbar.tax/100)
            total_bill += total_fee
        
        total_bill = fpformat.fix(total_bill, 2)
        total_bill = float(total_bill)

        # Payment with stripe
        try:
            total_bill = float(total_bill)
            amount = int(round(total_bill*100))
            stripe_payment = payments.StripePayment()
            charge = stripe_payment.charge(amount=amount, currency="USD", token=stripe_token)
            serializer.validated_data['transaction_code'] = stripe_token
            serializer.validated_data['transaction_id'] = charge.id
            serializer.validated_data['amount'] = float(amount/100)
            serializer.validated_data['channel'] = Order.CHANNEL_STRIPE
        except payments.StripePayment.StripePaymentException:
            raise api_utils.BadRequest('STRIPE_ERROR')
        except Exception as e:
            raise api_utils.BadRequest(e.message)

        # Create new order
        serializer.validated_data['amount'] = float(total_bill)
        serializer.validated_data['status'] = Order.STATUS_NEW

        
        order = serializer.create(serializer.validated_data)

        # Photo
        locate_image = os.path.join(settings.MEDIA_ROOT, order.photo.name)
        try:
            im = Image.open(order.photo)
            im = im.rotate(270, expand=1)
            # pprint.pprint(vars(im))
            # im.show()
            canvas = Image.new('RGB', im.size, (255,255,255,255))
            canvas.paste(im)
            canvas.save(locate_image)
        except Exception as e:
            subject = "Hi-Effeciency - System error [Image order]"
            html_content = render_to_string('email/error.html',
                                {'error':e})
            tasks.send_email(subject, html_content, ["ngochoang09121996@gmail.com"])
            pass

        tabs.update(order=order)
        
        
        for tab in Tab.objects.filter(order=order):
            tab.drink.make_drink(robot_will_do,tab.quantity)

        # Send receipt 
        subject = "Hi-Effeciency - New order"
        html_content = render_to_string('email/new_order_receipt.html',
                            {'user':request.user,
                            'order':order})
        tasks.send_email(subject, html_content, [request.user.email])
        # pprint(vars(serializer.data))
        headers = self.get_success_headers(serializer.data)
        return Response(OrderSmallSerializer(order).data, status=status.HTTP_201_CREATED, headers=headers)


class UserOrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderSmallSerializer

'''
Drink API:
'''

class DrinkCategoryList(generics.ListCreateAPIView):
    queryset = DrinkCategory.objects.all()
    serializer_class = DrinkCategorySerializer
    permission_classes = [IsAuthenticated, IsOpenTheBar]
    paginator = None

    def get_queryset(self):
        ret = self.queryset.filter(active=True)
        if self.request.user.is_superuser:
            ret = self.queryset.all()

        is_main = self.request.GET.get('main', False)
        if is_main:
            return ret.filter(parent__name="Type")

        search_query = self.request.GET.get('search', None)
        if search_query:
            ret = ret.filter(name__icontains=search_query)

        ancestor = self.request.GET.get('ancestor', None)
        if ancestor:
            ret = ret.filter(parent__isnull=True)

        parent = self.request.GET.get('parent', None)
        if parent:
            ret = ret.filter(parent=parent)

        return ret

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        temp = serializer.initial_data['slug']
        b = "~!@#$^&*()+=[];:?/,. " 
        for char in b:
            temp = temp.replace(char,"")
        serializer.validated_data['slug'] = temp

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class DrinkCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkCategory
    serializer_class = DrinkCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        try:
            if self.request.user.is_superuser:
                return DrinkCategoryStatisticSerializer
        except Exception as e:
            pass
        return DrinkCategorySerializer

class DrinkList(generics.ListCreateAPIView):
    queryset = Drink.objects.all().order_by('id')
    serializer_class = DrinkSerializer
    permission_classes = [IsAuthenticated, IsOpenTheBar]

    def get_serializer_class(self):
        try:
            is_admin = self.request.GET.get('admin', False)
            if self.request.method == 'GET' and is_admin == False:
                return DrinkSerializer
        except:
            pass
        return DrinkCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data['creator']=request.user
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        ret = self.queryset.exclude(Q(ingredients__ingredient__status=Ingredient.CONST_STATUS_BLOCKED)|\
                    Q(glass__status=SeparateGlass.CONST_STATUS_BLOCKED)|\
                    Q(status=Drink.CONST_STATUS_BLOCKED)).filter(creator__is_superuser=True)
        if is_admin:
            ret = self.queryset.filter(creator__is_superuser=True)

        search_query = self.request.GET.get('search', None)
        if search_query:
            ret = ret.filter(Q(name__icontains=search_query)|Q(ingredients__ingredient__name__icontains=search_query))

        category = self.request.GET.get('category', None)
        if category:
            ret = ret.filter(category=category)

        ingredient = self.request.GET.get('ingredient', None)
        if ingredient:
            drinks = DrinkIngredient.objects.filter(ingredient=ingredient).values_list('drink',flat=True)
            ret = ret.filter(id__in=drinks)

        ingredient_by = self.request.GET.get('ingredient_by', None)
        if ingredient_by:
            ingredient_by = ingredient_by.split(",")
            temp = DrinkIngredient.objects.exclude(ingredient__in=ingredient_by).values_list('drink',flat=True)
            temp = DrinkIngredient.objects.exclude(drink__in=temp).values_list('drink',flat=True)
            ret = ret.filter(id__in=temp)

        myfavorite = self.request.GET.get('myfavorite', None)
        if myfavorite:
            drinks = self.request.user.favorite_drink.all().values_list('id',flat=True)
            return ret.filter(id__in=drinks)

        sort = self.request.GET.get('sort', None)
        if sort:
            sort = sort.split(",")
            sort = list(sort)
            for s in sort:
                ret = ret.order_by(s)
        return ret

class DrinkDetial(generics.RetrieveUpdateDestroyAPIView):
    queryset = Drink
    serializer_class = DrinkUpdateSerializer
    permission_classes = [IsAuthenticated, IsOpenTheBar]

    def get_serializer_class(self):
        try:
            is_admin = self.request.GET.get('admin', False)
            if self.request.method == 'GET' and self.request.user.is_superuser == True:
                return DrinkWithStatisticSerializer
            if self.request.method == 'GET' and is_admin == False:
                return DrinkSerializer
            

        except Exception as e:
            pass
        return DrinkUpdateSerializer
     
class SeparateGlassList(generics.ListCreateAPIView):
    queryset = SeparateGlass.objects.all()
    serializer_class = SeparateGlassSerializer
    permission_classes = [permissions.IsAuthenticated, IsOpenTheBar]
    paginator = None

    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        ret = self.queryset.exclude(status=SeparateGlass.CONST_STATUS_BLOCKED)
        if is_admin:
            ret = self.queryset.all()
        return ret

class SeparateGlassDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = SeparateGlass
    serializer_class = SeparateGlassSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class GarnishList(generics.ListCreateAPIView):
    queryset = Garnish.objects.all()
    serializer_class = GarnishSerializer
    permission_classes = [IsAuthenticated]
    paginator = None

class GarnishDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Garnish
    serializer_class = GarnishSerializer
    permission_classes = [IsAuthenticated]

'''
Ingredient API
'''

class IngredientList(generics.ListCreateAPIView):
    queryset = Ingredient.objects.all().order_by('name')
    permission_classes = [IsAuthenticated, IsOpenTheBar]

    def get_serializer_class(self):
        try:
            if self.request.method == 'GET':
                return IngredientListSerializer
        except Exception as e:
            return IngredientListSerializer
        return IngredientCreateSerializer

    def get_queryset(self):
        is_admin = self.request.GET.get('admin', False)
        # ret = self.queryset.exclude(Q(status=Ingredient.CONST_STATUS_BLOCKED)|Q(price=0)|Q(price_per_ml=0))
        ingredientInRobot = RobotIngredient.objects.filter(remain_of_bottle__gt=0).values_list('ingredient_id',flat=True)
        ret = self.queryset.filter(id__in=ingredientInRobot)

        if is_admin or self.request.user.is_superuser:
            ret = self.queryset.all()

        search_query = self.request.GET.get('search', None)
        if search_query:
            ret = ret.filter(name__icontains=search_query)

        type = self.request.GET.get('type', None)
        if type:
            ret = ret.filter(type=type)

        brand = self.request.GET.get('brand', None)
        if brand:
            ret = ret.filter(brand=brand)

        ingredient_by = self.request.GET.get('ingredient_by', None)
        if ingredient_by:
            ret = ret.filter(type_search=ingredient_by)
        return ret.order_by('brand')

class IngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient
    serializer_class = IngredientCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        try:
            if self.request.method == 'GET':
                return IngredientListSerializer
        except Exception as e:
            return IngredientListSerializer
        return IngredientCreateSerializer

class IngredientTypeList(generics.ListCreateAPIView):
    queryset = IngredientType.objects.all().order_by('name')
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated, IsOpenTheBar]
    paginator = None

    def get_queryset(self):
        if self.request.user.is_superuser:
            return self.queryset.all()
        ingredientInRobot = RobotIngredient.objects.filter(remain_of_bottle__gt=0).values_list('ingredient__type',flat=True)
        # type_id = Ingredient.objects.filter(id__in=ingredientInRobot).values_list('type',flat=True)
        return self.queryset.filter(id__in=ingredientInRobot)

class IngredientTypeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = IngredientType
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated]

class IngredientBrandTypeList(generics.ListAPIView):
    '''
        Brand with ingredients denpend on it
    '''
    queryset = IngredientBrand.objects.all().order_by('name')
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated, IsOpenTheBar]
    paginator = None

    def get_serializer_class(self):
        ingredients = self.request.GET.get('ingredients', False)
        if ingredients:
            return IngredientBrandWithIngredientSerializer
        return IngredientBrandSerializer

    def get_queryset(self):

        try:
            ingredientInRobot = RobotIngredient.objects.filter(remain_of_bottle__gt=0).values_list('ingredient__brand',flat=True)
            type = self.request.GET.get('type', None)
            if self.request.user.is_superuser:
                return self.queryset.filter(ingredient_brands__type=type).distinct()
            ret = self.queryset.filter(id__in=ingredientInRobot,ingredient_brands__type=type).distinct()
        except Exception as e:
            raise api_utils.BadRequest("INVALID_TYPE")
        return ret

class IngredientBrandList(generics.ListCreateAPIView):
    queryset = IngredientBrand.objects.all().order_by('name')
    serializer_class = IngredientTypeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        try:
            brand = IngredientBrand.objects.get(name=request.data['name'])
        except Exception as e:
            brand = IngredientBrand(name=request.data['name'])
            brand.save()
        return Response(IngredientTypeSerializer(brand).data,status=status.HTTP_200_OK)
    
class IngredientBrandDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = IngredientBrand
    serializer_class = IngredientBrandSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientList(generics.ListCreateAPIView):
    queryset = DrinkIngredient.objects.all().order_by('name')
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]

class DrinkIngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DrinkIngredient
    serializer_class = DrinkIngredientSerializer
    permission_classes = [IsAuthenticated]



#Robot
# class RobotList(generics.ListAPIView):
class RobotList(generics.ListCreateAPIView):
    """
    Support 1 for now, cannot create new robot
    """
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer
    permission_classes = [IsAuthenticated]


class RobotDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Robot
    serializer_class = RobotSerializer
    permission_classes = [IsAuthenticated]
    '''
        update robot and ingredient robot contain
    '''

class RobotIngredientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RobotIngredient
    serializer_class = RobotIngredientSerializer
    permission_classes = [IsAuthenticated]


class IngredientHistoryList(generics.ListCreateAPIView):
    queryset = IngredientHistory.objects.all().order_by('-creation_date')
    serializer_class = IngredientHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ret = self.queryset
        robot = self.request.GET.get('robot',None)
        if robot:
            ret = ret.filter(machine=robot)
        return ret


class IngredientHistoryDetail(generics.RetrieveDestroyAPIView):
    # Change permission is not allowed.
    queryset = IngredientHistory
    serializer_class = IngredientHistorySerializer
    permission_classes = [IsSuperAdmin]

class RobotChange(APIView):
    permission_classes = [IsRobot]
    '''
        update robot status
    '''
    def post(self, request, format=None):
        ret = {}
        tab = None
        robot = self.request.data.get('robot',0)
        try:
            robot = Robot.objects.get(id=robot)
        except Exception as e:
            raise api_utils.BadRequest("INVALID_MACHINE")

        order = self.request.data.get('order',0)
        try:
            order = Order.objects.get(id=order)
        except Exception as e:
            raise api_utils.BadRequest("INVALID_ORDER")
        order.status = Order.STATUS_PROCESSING
        # try:
        status_drink = self.request.data.get('status_drink',None)
        if status_drink:
            # drink = tab
            status_drink=int(status_drink)
            tab = self.request.data.get('drink',0)
            try:
                tab = order.products.get(id=tab)
            except Exception as e:
                raise api_utils.BadRequest("INVALID_DRINK")
            # Change ingredient status
            if status_drink>30 and status_drink<40:
                ingredient = self.request.data.get('ingredient',None)
                try:
                    drink_ingredient = tab.drink.ingredients.get(ingredient__id=ingredient)
                except Exception as e:
                    raise api_utils.BadRequest("INVALID_INGREDIENT")

                try:
                    robot_ingredient = robot.ingredients.get(ingredient=drink_ingredient.ingredient)
                except Exception as e:
                    subject = "Hi-Effeciency - Robot {} don't have {}".format(robot.id, drink_ingredient.ingredient.name)
                    html_content = render_to_string('email/robot_error_1.html',{'ingredient':drink_ingredient.ingredient,'robot':robot.id})
                    tasks.send_email(subject, html_content, UserBase.objects.filter(is_superuser=True).values_list('email',flat=True))
                    raise api_utils.BadRequest("THIS_ROBOT_DONT_HAVE_THIS_INGREDIENT")

                # if robot_ingredient.remain_of_bottle < ratio_require:
                #     subject = 'Hi-Effeciency - Robot {} out of {}'.format(robot.id, robot_ingredient.ingredient.name)
                #     html_content = render_to_string('email/robot_error_2.html',{'ingredient':robot_ingredient})
                #     tasks.send_email(subject, html_content, UserBase.objects.filter(is_superuser=True).values_list('email',flat=True))
                #     raise api_utils.BadRequest("NOT ENOUGH INGREDIENT ON THIS ROBOT")
                    
                if robot_ingredient.remain_of_bottle < settingbar.bottle_waring:
                    # warning
                    subject = 'Hi-Effeciency - Robot {} almost out of {}'.format(robot.id, robot_ingredient.ingredient.name)
                    html_content = render_to_string('email/robot_warning.html',{'ingredient':robot_ingredient})
                    tasks.send_email(subject, html_content, UserBase.objects.filter(is_superuser=True).values_list('email',flat=True))

                ret['place_number'] = robot_ingredient.place_number
            if status_drink == Tab.STATUS_FINISHED:
                drink.quantity_done +=1
                if drink.quantity_done < drink.quantity:
                    status_drink = Tab.STATUS_NEW
            tab.status=status_drink
            tab.save()
        if order.products.all().count() == \
            order.products.filter(status=Tab.STATUS_FINISHED).count():
            order.status = Order.STATUS_FINISHED
        # except Exception as e:
        #     raise e
        order.save()
        if tab:
            ret['drink'] = OrderTabSerializer(instance=tab).data
        ret['order_status'] = order.status
        ret['order'] = OrderMachineSerializer(instance=order).data
        return Response(ret, status=status.HTTP_200_OK)

class Settings(generics.ListAPIView):
    queryset = SettingBar.objects.all()
    serializer_class = SettingsForUserSeirializer
    permission_classes = [IsAuthenticated]
    paginator = None

    def get(self, request, format=None):
        UserLog.objects.create(user=request.user)
        return super(Settings,self).get(request, format)

class SettingsAdmin(generics.RetrieveUpdateAPIView):
    queryset = SettingBar
    serializer_class = SettingsForAdminSeirializer
    permission_classes = [IsSuperAdmin]

    def update(self, request, *args, **kwargs):

        return super(SettingsAdmin,self).update(request, *args, **kwargs)


class Twitter(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self,request,format=None):
        data = tasks.twitter()
        ret = {}
        result=[]
        for d in data:
            d = vars(d)
            temp = d['_json']
            result.append(temp)
        ret['result'] = result
        return Response(ret,status=status.HTTP_200_OK)

class DoOneTime(APIView):
    permission_classes = [IsSuperAdmin]

    def get(self,request,format=None):
        # Update color for drink
        if request.GET.get('drink_color'):
            drinks = Drink.objects.all()
            for drink in drinks:
                drink.set_background_color()
        # Update order priority
        if request.GET.get('order_priority'):
            Order.objects.exclude(status__gte=Order.STATUS_FINISHED).update(priority=F('id'))

        return Response(status=status.HTTP_200_OK)

class DoTestSendEmail(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self,request,format=None):
        subject = 'Hi-Effeciency - Testing send email'
        order = Order.objects.all().last()
        html_content = render_to_string('email/new_order_receipt.html',{'user':request.user,
                            'order':order})
        tasks.send_email(subject, html_content, ['ngochoang09121996@gmail.com','vietndpd01144@gmail.com'])
        return Response({"detail":"THE EMAIL HAS BEEN SENT"},status=status.HTTP_200_OK)

class ContactUsSendEmail(APIView):
    
    def post(self,request,format=None):
        name = request.data.get('name',None)
        email = request.data.get('email',None)
        message = request.data.get('message',None)
        if not email or not name or not message:
            raise api_utils.BadRequest("MISSING INFORMATION")
        subject = 'Hi-Effeciency - Customer contact'
        html_content = render_to_string('email/contact_us.html',{'name':name,'email':email,'message':message})
        tasks.send_email(subject, html_content, ['inquary@hiefficiencybar.com',])
        return Response({"detail":"THE EMAIL HAS BEEN SENT"},status=status.HTTP_200_OK)


from threading import Thread
        
def async_ingredients(val,obj_drink):
    CONST_UNIT_PCS = 0
    exchange  = {
        14:DrinkIngredient.CONST_UNIT_PART,
        15:DrinkIngredient.CONST_UNIT_DROPS,
        16:DrinkIngredient.CONST_UNIT_TABLESPOON,
        17:DrinkIngredient.CONST_UNIT_DASH,
        18:CONST_UNIT_PCS,
        19:DrinkIngredient.CONST_UNIT_CUP,
        20:DrinkIngredient.CONST_UNIT_SPLASH,
        21:DrinkIngredient.CONST_UNIT_PINCH,
        22:DrinkIngredient.CONST_UNIT_PINT,
        23:DrinkIngredient.CONST_UNIT_BOTTLE,
        24:DrinkIngredient.CONST_UNIT_ML,
    }

    try:
        for i in range(0,10):
            if not val[i*14+13] or val[i*14+13]=="":
                break
            print val[i*14+13] 
            j = 0
            for j in range(14,25):
                if val[i*14+j]:
                    unit=exchange[j]
                    break;

            # process ratio
            try:
                ratio = float(val[i*14+j])
            except Exception as e:
                ratio = 0

            if val[i*14+18]:
                garnish = Garnish.objects.get_or_create(name=val[i*14+13])
                DrinkGarnish.objects.update_or_create (garnish=garnish[0], ratio=ratio, drink=obj_drink)
            else:
                type = IngredientType.objects.get_or_create(name=val[i*14+11])
                brand = IngredientBrand.objects.get_or_create(name=val[i*14+12])
                ingredient = Ingredient.objects.get_or_create(name=val[i*14+13],
                                                            type=type[0], brand=brand[0])
                DrinkIngredient.objects.update_or_create(ingredient=ingredient[0],
                                            unit=unit,
                                            ratio=ratio,drink=obj_drink)
    except Exception as e:
        raise e
    
class DrinkUploadFileView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsSuperAdmin]

    def post(self, request, *args, **kwargs):
    # try:
        file = request.data['file']
        # data = [row for row in csv.reader(file.read().splitlines())]
        for ind, val in enumerate(csv.reader(file.read().splitlines())):
            # First row, dismiss
            if ind == 0:
                continue 

            # Id process
            try:
                id_drink = int(val[0])
            except Exception as e:
                id_drink = 0

             # Ice id process
            if val[10].strip().lower() == 'Normal'.lower():
                is_have_ice = 0
            else:
                is_have_ice = 1

            # Category processin
            list_name = val[2].split(',');
            list_objct = []
            for name in list_name:
                obj_category = DrinkCategory.objects.get_or_create(name=name)
                list_objct.append(obj_category[0])

            # Glass process
            try:
                obj_glass = SeparateGlass.objects.get(name=val[7])
            except SeparateGlass.DoesNotExist:
                obj_glass = SeparateGlass.objects.create(name=val[7],size=0)

            # Add data in table drink
            if id_drink>0:
                obj_drink = Drink(id=id_drink,creation_date=datetime.now())
                obj_drink.save()
                obj_drink.category.clear()
                obj_drink.ingredients.all().delete()
                obj_drink.garnishes.all().delete()
            else:
                obj_drink = Drink()

            obj_drink.name = val[1] 
            obj_drink.image = val[3]
            # Edit data csv to image_background
            obj_drink.image_background = val[4]

            try:
                obj_drink.numbers_bought = int(val[5])
            except Exception as e:
                obj_drink.numbers_bought = 0

            try:
                obj_drink.price = float(val[6])
            except Exception as e:
                obj_drink.price = 0

            obj_drink.glass = obj_glass
            obj_drink.key_word = val[8]
            obj_drink.estimate_time = int(val[9] if val[9] else 0)
            obj_drink.is_have_ice = is_have_ice
            obj_drink.save()  
            obj_drink.set_background_color()

            # Add many to many
            obj_drink.category.add(*list_objct)

            thr = Thread(target=async_ingredients, args=[val,obj_drink])
            thr.start()
            
        return Response({'message':'Success'},status=status.HTTP_200_OK)
    # except Exception as e:
        raise api_utils.BadRequest("faild")
