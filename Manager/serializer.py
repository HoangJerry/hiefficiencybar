
from rest_framework import fields, serializers
from models import *
from pprint import pprint
import ast
import api_utils
from datetime import datetime, timedelta
from collections import Counter, OrderedDict
from django.utils import timezone
from django.db.models import Avg

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    class Meta:
        model = UserBase
        fields = ('first_name','last_name','email', 'password',
                'birthday','avatar',)

    def create(self, validated_data):
        if validated_data.has_key('password'):
            user = UserBase()
            user.set_password(validated_data['password'])
            validated_data['password'] = user.password
        if validated_data['email']:
            validated_data['username'] = validated_data['email']
        return super(UserSignupSerializer, self).create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.CharField(read_only=True)
    qr_code = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UserBase
        fields = ('id','username','password','email','avatar',
            'birthday','avatar_url', 'first_name','last_name', 
            'fb_uid', 'opt', 
            'is_email_verified', 'is_active', 'is_staff', 
            'is_superuser', 'last_login', 'date_joined','qr_code',
            'overall_spent','overall_drink')
        extra_kwargs = {'password': {'write_only': True},
                        'username': {'write_only': True},}

    def get_qr_code(self,obj):
        return obj.qr_code

    def create(self, validated_data):
        if validated_data.has_key('password'):
            user = UserBase()
            user.set_password(validated_data['password'])
            validated_data['password'] = user.password
        validated_data['is_active'] = True
        validated_data['is_staff'] = True
        validated_data['is_superuser'] = True
        return super(UserSerializer, self).create(validated_data)
class UserBaseSerializer(UserSerializer):

    class Meta(UserSerializer.Meta):
        fields = ('id','username','email','avatar','avatar_url',
                 'first_name','last_name', 'qr_code')

class UserWithTokenSerializer(UserSerializer):
    token = serializers.CharField(read_only=True)
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('token',)


'''
    Drink
'''


class DrinkCategorySerializer(serializers.ModelSerializer):
    link = serializers.SerializerMethodField('_name')
    main_level = serializers.SerializerMethodField('_main')
    slug = serializers.CharField(required=False)
    class Meta:
        model = DrinkCategory
        fields = '__all__' 
    def _name(self, obj):
        link = str(obj.get_absolute_url()).title()[1:]
        return link.replace("/", ", ")

    def _main(self, obj):
        link = str(obj.get_main_level()).title()[1:]
        return int(link)

class DrinkCategoryStatisticSerializer(DrinkCategorySerializer):
    user_purchase = serializers.SerializerMethodField()
    # class Meta(DrinkCategorySerializer.Meta):
    #     fields = DrinkCategorySerializer.Meta.fields + ('user_purchase')

    def get_user_purchase(self,obj):
        result = []
        for key in obj.user_purchase:
            ret = UserBaseSerializer(instance=UserBase.objects.get(pk=key)).data
            ret['count'] = obj.user_purchase[key]
            result.append(ret)
        return result
class DrinkCategorySmallSerializer(DrinkCategorySerializer):
    class Meta:
        model = DrinkCategory
        fields = ('id','link','main_level','name','image','main_level') 

class SeparateGlassSerializer(serializers.ModelSerializer):
    unit_view = serializers.SerializerMethodField(read_only=True)
    change_to_ml = serializers.SerializerMethodField(read_only=True)
    change_to_oz = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = SeparateGlass
        fields = '__all__' 

    def get_unit_view(self,obj):
        return obj.get_unit_display()
        
    def get_change_to_ml(self,obj):
        return obj.change_to_ml
        
    def get_change_to_oz(self,obj):
        return obj.change_to_oz

class GarnishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Garnish
        fields = '__all__'

class IngredientSmallSerializer(serializers.ModelSerializer):
    place_number = serializers.SerializerMethodField()
    class Meta:
        model = Ingredient
        fields = ('id','name','place_number')

    def get_place_number(self,obj):
        try:
            # filter(order__status=Order.Status.procesing)
            return obj.robots.first().place_number
        except Exception as e:
            return None
        
class DrinkGarnishSerializer(serializers.ModelSerializer):
    garnish = GarnishSerializer(read_only=True)
    class Meta:
        model = DrinkGarnish
        fields = ('id','garnish','ratio')

class DrinkIngredientSerializer(serializers.ModelSerializer):
    ingredient = IngredientSmallSerializer(read_only=True)
    unit_view = serializers.SerializerMethodField()

    class Meta:
        model = DrinkIngredient
        fields = ('ingredient','unit','unit_view','ratio','ratio_ml')

    def get_unit_view(self,obj):
        return obj.get_unit_display()



class DrinkUserOrdersSerializer(serializers.ModelSerializer):
    ingredients = DrinkIngredientSerializer(many=True, read_only=True)
    class Meta:
        model = Drink
        fields = ('id','name','image','price','ingredients')

    def get_glass_ml(self,obj):
        return obj.glass.change_to_ml

class DrinkOrdersSerializer(DrinkUserOrdersSerializer):
    glass_ml = serializers.SerializerMethodField()
    prep_view = serializers.SerializerMethodField()
    glass = SeparateGlassSerializer(read_only=True)
    class Meta(DrinkUserOrdersSerializer.Meta):
        model = Drink
        fields = DrinkUserOrdersSerializer.Meta.fields+('glass_ml',\
            'prep','prep_view',\
            'estimate_time','glass','total_part')

    def get_prep_view(self,obj):
        return obj.get_prep_display()

def drink_add_on(self, ret=None):
    categories = self.initial_data.get('category',None)
    if categories:
        categories = categories.split(",")
        for category in categories:
            try:
                ret.category.add(DrinkCategory.objects.get(id=category))
            except Exception as e:
                ret.delete()
                raise e
    if (self._context['request'].user.is_superuser and self.initial_data.has_key('image_background')):
        # data is array
        ingredients = self.initial_data.getlist('ingredients',None)
    else:
        # data is string array
        ingredients = ast.literal_eval(self.initial_data['ingredients'])
    tempdict=dict()

    if ingredients:
        total_percent = 0
        for ingredient in ingredients:
            if not type(ingredient)==type(tempdict):
                ingredient = ast.literal_eval(ingredient)
            if ingredient['unit']<1:
                total_percent += ingredient['ratio']
        if total_percent>100:
            ret.delete()
            raise api_utils.BadRequest("OVER 100%")
        for ingredient in ingredients:
            if not type(ingredient)==type(tempdict):
                ingredient = ast.literal_eval(ingredient)
            try:
                ingre = DrinkIngredient(drink=ret, ingredient=Ingredient.objects.get(id=ingredient['ingredient']),
                                ratio=ingredient['ratio'],
                                unit=ingredient['unit'])
                ingre.save()
            except Exception as e: 
                DrinkIngredient.objects.filter(drink=ret).delete()
                ret.delete()
                raise e

        # Direct unit
            ingredients = ret.ingredients.exclude(unit__in=[DrinkIngredient.CONST_UNIT_PART, DrinkIngredient.CONST_UNIT_PERCENT])
            total_ml = 0
            for ingredient in ingredients:
                ingredient.ratio_ml = ingredient.change_to_ml()
                ingredient.save()
                total_ml += ingredient.ratio_ml
            glass = ret.glass.change_to_ml - total_ml
            # Percent unit
            ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PERCENT)
            if glass>0:
                for ingredient in ingredients:
                    ingredient.ratio_ml = ingredient.change_to_ml(glass=glass)
                    ingredient.save()
            else:
                ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PERCENT).update(ratio_ml=0)
            # Part unit
            glass = glass*(100-total_percent)/100
            ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PART)
            total_part = ret.total_part

            if glass>0 and total_part>0:
                for ingredient in ingredients:
                    ingredient.ratio_ml = ingredient.change_to_ml(total_part=total_part, glass=glass)
                    ingredient.save()
            else: 
                ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PART).update(ratio_ml=0)
    else:
        ret.delete()
        raise api_utils.BadRequest("NOT INCLUDE ANY INGREDIENT, ADD ONE!")
    garnishes = self.initial_data.getlist('garnishes',None)
    if garnishes:
        for garnish in garnishes:
            garnish = ast.literal_eval(garnish)
            try:
                garn = DrinkGarnish(drink=ret, garnish=Garnish.objects.get(id=garnish['garnish']),
                                ratio=garnish['ratio'],)
                garn.save()
            except Exception as e:
                DrinkIngredient.objects.filter(drink=ret).delete()
                DrinkGarnish.objects.filter(drink=ret).delete()
                ret.delete()
                raise e
    return ret


class DrinkSerializer(serializers.ModelSerializer):
    numbers_bought = serializers.IntegerField(read_only=True)
    category = DrinkCategorySmallSerializer(many=True, read_only=True)
    glass = SeparateGlassSerializer(read_only=True)
    ingredients = DrinkIngredientSerializer(many=True, read_only=True)
    garnishes = serializers.SerializerMethodField('_garnishes')
    creator = UserSerializer(read_only=True)
    is_favorite = serializers.SerializerMethodField(read_only=True)
    prep_view = serializers.SerializerMethodField()

    class Meta:
        model = Drink
        fields = ('id','status','prep','prep_view','numbers_bought','category','glass','ingredients',
            'garnishes','name','image','image_background','background_color','price','creator','creation_date',
            'key_word','estimate_time','is_have_ice','is_favorite','is_fit_price')
        # depth = 1

    def get_is_favorite(self, obj):
        if super(DrinkSerializer,self).context['request'].user.favorite_drink.filter(id=obj.id):
            return True
        return False

    def _garnishes(self, obj):
        # hide garnish with is not active for user
        qs = DrinkGarnish.objects.filter(drink=obj, garnish__active=True)
        serializer = DrinkGarnishSerializer(instance=qs, many=True)
        return serializer.data

    def get_prep_view(self,obj):
        try:
            return obj.get_prep_display()
        except Exception as e:
            pass

class DrinkWithStatisticSerializer(DrinkSerializer):
    user_purchase = serializers.SerializerMethodField()

    class Meta(DrinkSerializer.Meta):
        fields = DrinkSerializer.Meta.fields + ('user_purchase',)
    def get_user_purchase(self,obj):
        result = []
        for key in obj.user_purchase:
            ret = UserBaseSerializer(instance=UserBase.objects.get(pk=key)).data
            ret['count'] = obj.user_purchase[key]
            result.append(ret)
        return result

class DrinkUpdateSerializer(DrinkSerializer):
    garnishes = DrinkGarnishSerializer(many=True, required=False, read_only=True)

    def update(self, instance, validated_data):
        ret = super(DrinkSerializer,self).update(instance, validated_data)
        if self.initial_data.has_key('category'):
            ret.category.clear()

            categories = self.initial_data.get('category')
            categories = categories.split(",")
            for category in categories:
                try:
                    ret.category.add(DrinkCategory.objects.get(id=category))
                except Exception as e:
                    raise api_utils.BadRequest(e[0])

        if self.initial_data.has_key('ingredients'):
            
            ingredients = self.initial_data.getlist('ingredients')
            total_percent = 0
            for ingredient in ingredients:
                ingredient = ast.literal_eval(ingredient)
                if ingredient['unit']<1:
                    total_percent += ingredient['ratio']

            if total_percent>100:
                raise api_utils.BadRequest("OVER 100%")
            # Save new data
            ret.ingredients.all().delete()
            for ingredient in ingredients:
                ingredient = ast.literal_eval(ingredient)
                ingre = DrinkIngredient(drink=ret, ingredient=Ingredient.objects.get(id=ingredient['ingredient']),
                                ratio=ingredient['ratio'],
                                unit=ingredient['unit'])
                ingre.save()
            
            # Direct unit
            ingredients = ret.ingredients.exclude(unit__in=[DrinkIngredient.CONST_UNIT_PART, DrinkIngredient.CONST_UNIT_PERCENT])
            total_ml = 0
            for ingredient in ingredients:
                ingredient.ratio_ml = ingredient.change_to_ml()
                ingredient.save()
                total_ml += ingredient.ratio_ml
            glass = ret.glass.change_to_ml - total_ml
            # Percent unit
            ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PERCENT)
            if glass>0:
                for ingredient in ingredients:
                    ingredient.ratio_ml = ingredient.change_to_ml(glass=glass)
                    ingredient.save()
            else:
                ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PERCENT).update(ratio_ml=0)
            # Part unit
            glass = glass*(100-total_percent)/100
            ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PART)
            total_part = ret.total_part

            if glass>0 and total_part>0:
                for ingredient in ingredients:
                    ingredient.ratio_ml = ingredient.change_to_ml(total_part=total_part, glass=glass)
                    ingredient.save()
            else: 
                ingredients = ret.ingredients.filter(unit=DrinkIngredient.CONST_UNIT_PART).update(ratio_ml=0)
        
        # Garnish
        if self.initial_data.has_key('garnishes'):
            ret.garnishes.all().delete()

            garnishes = self.initial_data.getlist('garnishes')
            if garnishes:
                for garnish in garnishes:
                    garnish = ast.literal_eval(garnish)
                    try:
                        garn = DrinkGarnish(drink=ret, garnish=Garnish.objects.get(id=garnish['garnish']),
                                        ratio=garnish['ratio'],)
                        garn.save()
                    except Exception as e:
                        raise api_utils.BadRequest(e[0])
        ret.save()
        return ret

class DrinkCreateSerializer(serializers.ModelSerializer):
    ingredients = DrinkIngredientSerializer(many=True, required=False, read_only=True)
    garnishes = DrinkGarnishSerializer(many=True, required=False, read_only=True)
    category = DrinkCategorySmallSerializer(many=True, read_only=True)
    class Meta:
        model = Drink
        fields = ('id','status','prep','numbers_bought','category','glass','ingredients',
            'garnishes','name','image','image_background','price','creator',
            'creation_date','key_word','estimate_time','is_have_ice')

    def create(self, validated_data):
        ret = Drink(**validated_data)
        ret.save()
        ret = drink_add_on(self, ret)
        ret.save()
        save_drink =  Drink.objects.get(id=ret.id)
        save_drink.price = ret.price
        if not ret.creator.is_superuser:
            save_drink.image = ret.glass.image
        save_drink.save()
        return save_drink

'''
    Ingredient
'''
class IngredientTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientType
        fields = '__all__'

class IngredientBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientBrand
        fields = '__all__'

class IngredientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class IngredientListSerializer(IngredientCreateSerializer):
    type = IngredientTypeSerializer(read_only=True)
    brand = IngredientBrandSerializer(read_only=True)
    type_search_view = serializers.SerializerMethodField(read_only=True)
    background_color_apps = serializers.SerializerMethodField(read_only=True)

    def get_background_color_apps(self,obj):
        try: 
            temp = obj.background_color[4:-1]
            return temp.replace(",", "-")
        except:
            return None
    def get_type_search_view(self,obj):
        return obj.get_type_search_display()

class IngredientBrandWithIngredientSerializer(IngredientBrandSerializer):
    ingredient_brands = serializers.SerializerMethodField() 
    
    class Meta:
        model = IngredientBrand
        fields = '__all__'

    def get_ingredient_brands(self,obj):
        ingredientInRobot = RobotIngredient.objects.filter(remain_of_bottle__gt=0).values_list('ingredient_id',flat=True)
        query = obj.ingredient_brands.filter(id__in=ingredientInRobot)
        return IngredientListSerializer(instance=query, many=True).data


class IngredientHistorySerializer(serializers.ModelSerializer):
    ingredient_view = IngredientCreateSerializer(source='ingredient' ,read_only=True)

    class Meta:
        model = IngredientHistory
        fields = '__all__'


'''
    Robot
'''
class RobotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Robot
        fields = ('id','status','creation_date','ingredients')
        depth = 2

class RobotIngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = RobotIngredient
        fields = '__all__'
'''
    Tab
'''
class AddToTabSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, read_only=True)
    garnishes = DrinkGarnishSerializer(many=True, read_only=True)
    class Meta:
        model = Tab
        fields = '__all__'
    def check_available(self, tab, quantity=None):
        if not quantity:
            quantity = tab.quantity
        for robot in Robot.objects.all():
            if tab.drink.is_enough_ingredient(robot,quantity):
                return True
        return False

    def create(self, validated_data):
        validated_data['drink'].save()
        if validated_data['drink'].price<=0:
            raise api_utils.BadRequest("CANT NOT ORDER DRINK UNDER $0!")

        if validated_data['drink'].status==Drink.CONST_STATUS_BLOCKED:
            raise api_utils.BadRequest("THIS DRINK HAS BEEN BLOCKED AT THE MOMENT, PLEASE RELOAD")

        ret = Tab(**validated_data)
        tab = Tab.objects.filter(drink=ret.drink, user=ret.user, order__isnull=True)
        if not tab:
            if not check_available(ret):
                raise api_utils.BadRequest("NOT ENOUGH INGREDIENT FOR {} QUANTITY,PLEASE RELOAD!".format(ret))
            garnishes = self.initial_data.get('garnishes')
            if garnishes:
                garnishes = DrinkGarnish.objects.filter(drink=ret.drink,garnish__in=ast.literal_eval(garnishes))
                garnishes = list(garnishes)
                ret.garnishes.add(*garnishes)
        else:
            temp = ret
            ret = tab.first()
            if not check_available(temp):
                raise api_utils.BadRequest("NOT ENOUGH INGREDIENT FOR ADD MORE {} QUANTITY,PLEASE RELOAD".format(ret))
            ret.quantity +=temp.quantity
            ret.save()
        return ret

class TabSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, read_only=True)
    drink = DrinkUserOrdersSerializer(required=False, read_only=True)
    garnishes = DrinkGarnishSerializer(many=True, read_only=True)
    ice_view = serializers.SerializerMethodField(read_only=True)
    status_view = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Tab
        fields = '__all__'

    def get_ice_view(self,obj):
        return obj.get_ice_display()

    def get_status_view(self,obj):
        return obj.get_status_display()

class UserOrderTabSerializer(TabSerializer):
    class Meta:
        model = Tab
        fields = ('id','drink','status','status_view','ice','ice_view','garnishes','quantity','amount')

class OrderTabSerializer(UserOrderTabSerializer):
    drink = DrinkOrdersSerializer(required=False, read_only=True)

'''
    Order
'''

class OrderSmallSerializer(serializers.ModelSerializer):
    # For user
    products = UserOrderTabSerializer(many=True, required=False, read_only=True)
    qr_code = serializers.SerializerMethodField(read_only=True)
    status_view = serializers.SerializerMethodField(read_only=True)
    user_view = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Order
        fields = ('id','status','status_view','creation_date','amount',
            'channel','transaction_code','transaction_id','amount_without_fee',
            'payer_firstname','payer_lastname','payer_email',
            'tray_number','products','qr_code','total_time','photo','robot','user_view','priority')

    def get_status_view(self,obj):
        try:
            return obj.get_status_display()
        except:
            pass

    def get_user_view(self,obj):
        return obj.user.full_name

    def get_qr_code(self,obj):
        return obj.qr_code

class OrderSerializer(OrderSmallSerializer):
    user = UserSerializer(required=False, read_only=True)
    class Meta(OrderSmallSerializer.Meta):
        model = Order
        fields = ('id','status','status_view','creation_date','amount',
            'channel','transaction_code','transaction_id',
            'payer_firstname','payer_lastname','payer_email',
            'tray_number','products','photo','user')

class OrderMachineSerializer(OrderSerializer):
    '''
        Order with ingredient for machine create a drink
        Use in socket
    '''
    user = UserSerializer(required=False, read_only=True)
    products = OrderTabSerializer(many=True, required=False, read_only=True)
    statistic_orders_today = serializers.SerializerMethodField(read_only=True)
    statistic_orders_drink_today = serializers.SerializerMethodField(read_only=True)
    statistic_avg_time_per_drink_today = serializers.SerializerMethodField(read_only=True)
    class Meta(OrderSmallSerializer.Meta):
        model = Order
        fields = OrderSmallSerializer.Meta.fields +('user','statistic_orders_today',
                    'statistic_orders_drink_today','statistic_avg_time_per_drink_today') 

    def get_statistic_orders_today(self,obj):
        today = date.today()
        return Order.objects.filter(creation_date__date=today,status=Order.STATUS_FINISHED).count()

    def get_statistic_avg_time_per_drink_today(self,obj):
        today = date.today()
        orders = Tab.objects.filter(order__creation_date__date=today).aggregate(Avg('drink__estimate_time'))
        return orders['drink__estimate_time__avg']

    def get_statistic_orders_drink_today(self,obj):
        today = date.today()
        orders = Order.objects.filter(creation_date__date=today)
        temp = list() 
        for order in orders:
            temp += order.products.all().values_list('drink', flat=True)
        ret = Counter(temp).most_common(3)
        ret =  dict(ret)
        ret = OrderedDict(sorted(ret.items(), key=lambda t: t[1], reverse=True))
        temp = list()
        for key, value in ret.items():
            temp.append(Drink.objects.get(id=key))
        return DrinkUserOrdersSerializer(instance=temp, many=True).data
    
class UserWithOrderSerializer(UserSerializer):
    orders = serializers.SerializerMethodField(read_only=True)
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('orders',)

    def get_orders(self,obj):
        return OrderSmallSerializer(instance=obj.orders.order_by('-creation_date'), many=True).data

class SettingsForUserSeirializer(serializers.ModelSerializer):
    fee_unit_view = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = SettingBar
        fields = ('bar_status','max_drink_order','fee','fee_unit','fee_unit_view','tax')
    def get_fee_unit_view(self,obj):
        return obj.get_fee_unit_display()

class SettingsForAdminSeirializer(SettingsForUserSeirializer):

    class Meta(SettingsForUserSeirializer.Meta):
        model = SettingBar
        fields = SettingsForUserSeirializer.Meta.fields+('bottle_waring',)
