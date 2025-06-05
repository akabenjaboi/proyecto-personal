from django.db import models

# Create your models here.

# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_ROLES = (
        ('student', 'Estudiante'),
        ('landlord', 'Arrendador'),
    )
    role = models.CharField(max_length=10, choices=USER_ROLES)
    university = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)  # Nuevo campo

    def is_student(self):
        return self.role == 'student'

    def is_landlord(self):
        return self.role == 'landlord'
