from django.contrib import admin

# Register your models here.
# listings/admin.py
from django.contrib import admin
from .models import Room

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('title', 'city', 'price', 'available_from', 'owner')
