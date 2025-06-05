# listings/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.room_list, name='room_list'),
    path('<int:pk>/', views.room_detail, name='room_detail'),
    path('new/', views.room_create, name='room_create'),
    path('<int:pk>/edit/', views.room_update, name='room_update'),
    path('<int:pk>/delete/', views.room_delete, name='room_delete'),  # Añade esta línea
    path('<int:pk>/archive/', views.room_archive, name='room_archive'),
]
