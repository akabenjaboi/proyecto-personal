# accounts/forms.py
from django import forms
from .models import User
from django.contrib.auth.forms import UserCreationForm

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'role', 'university', 'phone', 'password1', 'password2')
