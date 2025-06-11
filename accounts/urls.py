# accounts/urls.py
from django.urls import path
from . import views
from .views import user_list_create_api, user_detail_api
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.profile_view, name='profile'),
    path('editProfile/', views.editProfile_view, name='editProfile'),  # Añadido perfil de usuario
    path('api/users/', user_list_create_api, name='user-list-create-api'),
    path('api/users/<int:pk>/', user_detail_api, name='user-detail-api'),
]
