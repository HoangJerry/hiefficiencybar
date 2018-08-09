import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

USE_TZ = False

SITE_URL = "http://localhost:8000"
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'blur-admin/release'), 
                    os.path.join(BASE_DIR, 'drinkbar/templates/webpage'),
                    os.path.join(BASE_DIR, 'drinkbar/templates/email/static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATIC_URL = SITE_URL+"/static/" 
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = SITE_URL+"/media/"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'drinkBar',                      # Or path to database file if using sqlite3.
        'USER': 'root',
        'PASSWORD': 'softdev',
        'HOST': 'localhost',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '3306',                      # Set to empty string for default.
    }
}