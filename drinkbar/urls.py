"""drinkbar URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import handler404, handler500

from Manager import urls as api_urls
from Manager import views
from django.views.generic import TemplateView

from rest_framework import routers
from rest_framework.documentation import include_docs_urls

API_TITLE = 'Hi-efficiency'
API_DESCRIPTION = 'API short description'

if settings.DEVELOPING_MODE:
    urlpatterns =[ url(r'', views.ErrorPage.as_view(), name='error'), ]
    urlpatterns +=[ url(r'/', views.ErrorPage.as_view(), name='error'), ]
else:
    urlpatterns = [
        url(r'^admin/', admin.site.urls),
        url(r'^api/', include(api_urls)),
        url(r'^verify/email/$', views.VerificationEmail.as_view(), name='user-verify-email'), 
        url(r'^$', views.HomePage.as_view(), name='index'), 
        url(r'^front-bar/$', views.FrontBarPage.as_view(), name='front-bar-page'), 
        url(r'^back-bar/$', views.BackBarPage.as_view(), name='back-bar-page'), 
        url(r'^home-bar/$', views.HomeBarPage.as_view(), name='home-bar-page'), 
        url(r'^mobile-bar/$', views.MobileBarPage.as_view(), name='mobile-bar-page'),

        url(r'^docs/', include_docs_urls(title=API_TITLE, description=API_DESCRIPTION))
    ]

    # router = routers.DefaultRouter()
    # router.register("drink/search", views.DrinkSearchView, base_name="drink-search")
    # urlpatterns += router.urls

    if settings.DEBUG:
        urlpatterns += static(settings.STATIC_URL.replace(settings.SITE_URL, ''), document_root=settings.STATIC_ROOT)
        urlpatterns += static(settings.MEDIA_URL.replace(settings.SITE_URL, ''), document_root=settings.MEDIA_ROOT)
        urlpatterns += static(r'bluradmin/assets', document_root='./static/assets')

    urlpatterns += [
        url(r'^bluradmin/', TemplateView.as_view(template_name="index.html")),
    ]

    urlpatterns += [ url(r'^robots.txt$', views.RobotsPage.as_view(), name='robots.txt'), ]

    urlpatterns +=[ url(r'/', views.ErrorPage.as_view(), name='error'), ]
