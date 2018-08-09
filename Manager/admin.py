# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib import auth
from django.contrib.auth.admin import UserAdmin
from .models import *
from django.utils.translation import ugettext_lazy as _
from categories.models import Category as DefaultCategory

from import_export import resources, fields
from import_export.admin import ImportExportModelAdmin
from import_export.widgets import ForeignKeyWidget, ManyToManyWidget
from django.contrib.admin import AdminSite
# # Register your models here.
admin.site.unregister(auth.models.Group)
admin.site.unregister(DefaultCategory)

class MyAdminSite(AdminSite):
    site_header = 'Jerry change'
    site_title = "Drink bar admin site"
    
admin_site = MyAdminSite(name='myadmin')
# admin_site.register()

'''
Order
'''


class TabInline(admin.TabularInline):
    model = Tab
    extra = 0

class TabAdmin(admin.ModelAdmin):
    list_display = ('user','drink', 'ice', 'quantity',
             'order','modified_date','creation_date')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','status','user','amount',
            'channel','transaction_code','transaction_id',
            'tray_number','robot','creation_date','total_time','priority')
    readonly_fields = ('amount',)
    inlines = (TabInline,)
    select_related = ['user']
    date_hierarchy = 'creation_date'
# class OrderInline(admin.TabularInline):
#     model = Order
#     extra = 1
#     fields= ('_id_order','creation_date','amount','status','line_taking')
#     readonly_fields = ('creation_date',)
#     def has_add_permission(self, request, obj=None):
#         return False

#     can_delete = False
#     def _id_order(self, obj):
#         return '<a href="{}" target="blank">{}</a>'.format(obj.url_store_platform,obj.url_store_platform)
#     _id_order.allow_tags = True


class UserBaseAdmin(UserAdmin):
    list_display = ('id','email','first_name','last_name','birthday')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('username','email', 'password')}),
        (_('Personal info'),
            {'fields': ('first_name', 'last_name', 'birthday','avatar',
            'avatar_url','is_email_verified','is_robot','fb_uid','opt')}),
        (_('Permissions'), 
            {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), 
            {'fields': ('last_login', 'date_joined')}),
        )

    readonly_fields = ('fb_uid',)
    # inlines = (OrderInline,)

'''
Ingredient
'''
class IngredientBrandAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    search_fields= ('name',)
class IngredientTypeAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    pass

class IngredientAdminResource(resources.ModelResource):
    brand = fields.Field(
        column_name='brand',
        attribute='brand',
        widget=ForeignKeyWidget(IngredientBrand, 'name'))

    type = fields.Field(
        column_name='type',
        attribute='type',
        widget=ForeignKeyWidget(IngredientType, 'name'))

    class Meta:
        model = Ingredient

class IngredientHistoryInline(admin.TabularInline):
    model = IngredientHistory
    extra = 1

class IngredientHistoryAdmin(admin.ModelAdmin):
    list_display = ('creation_date', 'status', 'machine','ingredient','quantity')

    
class IngredientAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    resource_class = IngredientAdminResource
    list_display = ('type', 'brand', 'name', 'status', 'price', 
        'bottles','quanlity_of_bottle')

    search_fields = ('name',)
    list_editable = ('status',)
    inlines = (IngredientHistoryInline,)


'''
Drink 
'''
class DrinkCategoryResource(resources.ModelResource):
    parent = fields.Field(
        column_name='parent',
        attribute='parent',
        widget=ForeignKeyWidget(DrinkCategory, field='name'))

    class Meta:
        model = DrinkCategory

class DrinkCategoryAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id','name','_link','active')
    fieldsets = (
        (None, {
            'fields': ('parent', 'name','active','image',)
        }),
    )
    

    def _link(self, obj):
        link = str(obj.get_absolute_url()).title()[1:]
        return link.replace("/", ", ")
    _link.short_description = 'Full Category'
   
class SeparateGlassAdmin(admin.ModelAdmin):
    list_display = ('name','status','image','size','unit','_ml')

    list_editable = ('status',)
    def _ml(self, obj):
        return obj.change_to_ml

class GarnishAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('id','name','active')
    list_editable = ('active',)

class DrinkIngredientInline(admin.TabularInline):
    model = DrinkIngredient
    extra = 1

class DrinkGarnishInline(admin.TabularInline):
    model = DrinkGarnish
    extra = 1

class DrinkAdminResource(resources.ModelResource):
    glass = fields.Field(
        column_name='glass',
        attribute='glass',
        widget=ForeignKeyWidget(SeparateGlass, 'name'))

    category = fields.Field(
        column_name='category',
        attribute='category',
        widget=ManyToManyWidget(DrinkCategory, field='name'))

    class Meta:
        model = Drink
        fields = ('id','name','image','image_background','category',
            'numbers_bought','price','glass','key_word',
            'estimate_time','is_have_ice')


class DrinkAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    resource_class = DrinkAdminResource
    list_display = ('name','glass','numbers_bought','price')
    readonly_fields = ('numbers_bought',)

    filter_horizontal = ('category',)
    search_fields = ('name','id',)
    list_filter = ('category',)
    inlines = (DrinkIngredientInline,DrinkGarnishInline)

class DrinkIngredientAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('drink','ingredient','ratio','unit')



'''
Robot
'''
class RobotIngredientInline(admin.TabularInline):
    model = RobotIngredient
    extra = 1
    max_num = 70
    readonly_fields = ('remain_of_bottle',)

class RobotAdmin(admin.ModelAdmin):
    list_display = ('id', 'status')
    list_editable = ('status',)
    inlines = (RobotIngredientInline,)

    def has_add_permission(self, obj):
        return False

class SettingsAdmin(admin.ModelAdmin):
    list_display = ('id','bar_status','max_drink_order','fee','fee_unit','tax')
    list_editable = ('bar_status',)
    
    fieldsets = (
        (_('Main settings:'), {
            'fields': ('bar_status',)
        }),
        (_('Drink settings:'), {
            'fields': ('bottle_waring', 'max_drink_order',)
        }),
        (_('Fee and tax:'), {
            'fields': (('fee', 'fee_unit'),'tax')
        }),
    )
class UserLogAdmin(admin.ModelAdmin):
    list_display = ('id','user','creation_date')

admin.site.register(UserBase, UserBaseAdmin)
admin.site.register(UserLog, UserLogAdmin)
admin.site.register(DrinkCategory, DrinkCategoryAdmin)
admin.site.register(Drink,DrinkAdmin)
admin.site.register(DrinkIngredient, DrinkIngredientAdmin)
admin.site.register(Ingredient, IngredientAdmin)
admin.site.register(IngredientHistory, IngredientHistoryAdmin)
admin.site.register(IngredientBrand, IngredientBrandAdmin)
admin.site.register(IngredientType, IngredientTypeAdmin)
admin.site.register(Garnish, GarnishAdmin)
admin.site.register(Robot, RobotAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(SeparateGlass, SeparateGlassAdmin)
admin.site.register(Tab, TabAdmin)
admin.site.register(SettingBar, SettingsAdmin)
