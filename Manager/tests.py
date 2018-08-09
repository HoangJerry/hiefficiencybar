# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.urls import reverse

from django.test import TestCase
from django.test import Client
# Create your tests here.
from .models import *

from rest_framework.test import APIRequestFactory
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
# class CreateDrink(TestCase):
#     def setUp(self):
#         Drink.objects.create(name="Test drink with user")
#         Drink.objects.create(name="Test drink with user admin")


class DRFTesting(APITestCase):
    def test_create_admin_user(self):
        UserBase.objects.create(username='admin', email='admin', password="coca123@")
        self.assertEqual(UserBase.objects.count(), 1)

    def test_create_seting_bar(self):
        SettingBar.objects.create(fee_unit=SettingBar.CONST_FEE_DOLLAR)
        self.assertEqual(SettingBar.objects.count(), 1)

    def test_create_drink_not_authentificate(self):
        """
        Ensure we can create a new drink object.
        """
        url = reverse('drink-list')
        data = {'name': 'Testing Drink'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_drink_created_by_admin(self):
        """
        Ensure we can create a new drink object.
        """
        self.test_create_admin_user()
        self.test_create_seting_bar()
        user = UserBase.objects.get(username='admin')
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + user.token)
        url = reverse('drink-list')
        data = {
            'name': 'Testing Drink',
            'ingredients':'[{"unit":"0","ratio":2,"ingredient":2001},{"unit":"0","ratio":2,"ingredient":2001}]'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
