from django.urls import path
from . import views

app_name = 'booking'

urlpatterns = [
    path('', views.booking_list, name='booking_list'),
    path('<int:pk>/', views.booking_detail, name='booking_detail'),
    path('new/<int:room_id>/', views.booking_create, name='booking_create'),
    path('<int:pk>/edit/', views.booking_update, name='booking_update'),
    path('<int:pk>/delete/', views.booking_delete, name='booking_delete'),
    path('<int:pk>/approve/', views.booking_approve, name='booking_approve'),
    path('<int:pk>/reject/', views.booking_reject, name='booking_reject'),
]