# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView
from .models import *
from .api import SendVerificationEmail
import hashlib

class VerificationEmail(TemplateView):
    template_name = "inform.html"

    def get_verification_code(self, user):
        code = '{}++{}++{}'.format(settings.SECRET_KEY, user.id, user.email)
        return '{}_{}'.format(hashlib.sha1(code).hexdigest(),user.id)


    def get_context_data(self, **kwargs):
        ret = super(VerificationEmail, self).get_context_data(**kwargs)
        verification_code = self.request.GET.get('code',None)
        if verification_code:
            code, user_id = verification_code.split('_')
            user = UserBase.objects.filter(pk=user_id).first()

            if not user:
                raise api_utils.BadRequest('INVALID_USER')

            if verification_code == self.get_verification_code(user):
                user.is_email_verified = True
                user.save()
                ret['message'] = 'Email verification is successful.'
            else:
                ret['message'] ='INVALID EMAIL VERIFICATION CODE.'
        else:
            ret['message'] ='INVALID EMAIL VERIFICATION CODE.'
        return ret

class ErrorPage(TemplateView):
    template_name = "inform.html"
    status_code = 404

    def get_context_data(self, **kwargs):
        context = super(ErrorPage,self).get_context_data(**kwargs)
        context['message'] = "404...Page not found!"
        return context

class RobotsPage(TemplateView):
    template_name = "robots.html"

class HomePage(TemplateView):
    template_name = "webpage/index.html"

    def get_context_data(self, **kwargs):
        context = super(HomePage,self).get_context_data(**kwargs)
        context['title'] = "Home"
        return context

class FrontBarPage(TemplateView):
    template_name = "webpage/frontBar.html"


    def get_context_data(self, **kwargs):
        context = super(FrontBarPage,self).get_context_data(**kwargs)
        context['title'] = "Front Bar"
        return context

class BackBarPage(TemplateView):
    template_name = "webpage/backBar.html"

    def get_context_data(self, **kwargs):
        context = super(BackBarPage,self).get_context_data(**kwargs)
        context['title'] = "Back Bar"
        return context

class HomeBarPage(TemplateView):
    template_name = "webpage/homeBar.html"

    def get_context_data(self, **kwargs):
        context = super(HomeBarPage,self).get_context_data(**kwargs)
        context['title'] = "Home Bar"
        return context

class MobileBarPage(TemplateView):
    template_name = "webpage/mobileBar.html"

    def get_context_data(self, **kwargs):
        context = super(MobileBarPage,self).get_context_data(**kwargs)
        context['title'] = "Mobile Bar"
        return context

from drf_haystack.filters import HaystackAutocompleteFilter
from drf_haystack.filters import HaystackHighlightFilter
from drf_haystack.mixins import MoreLikeThisMixin
from drf_haystack.serializers import HaystackSerializer
from drf_haystack.viewsets import HaystackViewSet

from rest_framework import serializers
from .search_indexes import DrinkIndex

class DrinkSerializer(HaystackSerializer):

    more_like_this = serializers.HyperlinkedIdentityField(view_name="drink-search-more-like-this", read_only=True)

    class Meta:
        index_classes = [DrinkIndex]
        fields = ['name', 'text', 'key_word', "autocomplete"]
        # ignore_fields = ["autocomplete"]
        field_aliases = {
            "q": "autocomplete"
        }

class DrinkSearchView(MoreLikeThisMixin, HaystackViewSet):
    # queryset = Drink.objects.all()
    index_models = [Drink]
    serializer_class = DrinkSerializer
    filter_backends = [HaystackAutocompleteFilter, HaystackHighlightFilter]

    # def get_queryset(self, index_models=[]):
    #   return super(DrinkSearchView, self).get_queryset(index_models).filter(status=0)