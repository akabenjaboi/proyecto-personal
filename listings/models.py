from django.db import models
from django.conf import settings

# Create your models here.
# listings/models.py

class Room(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    city = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    available_from = models.DateField()
    available_to = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    archived = models.BooleanField(default=False)  # Nuevo campo

    def __str__(self):
        return self.title

class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='room_images/')
