# from django.urls import path
# from . import views

# app_name = 'core'
# "kenapa ada app name = core? karena kita akan menggunakan namespace untuk menghindari konflik nama url dengan aplikasi lainnya dalam proyek Django. Dengan menetapkan app_name, kita dapat merujuk ke URL dalam aplikasi ini menggunakan namespace 'core', seperti 'core:home' atau 'core:about'. Ini membantu menjaga kode kita terorganisir dan mencegah kebingungan ketika kita memiliki banyak aplikasi dalam proyek yang sama."

# urlpatterns = [
#     path('', views.home, name='home'),
# ]

# core/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]