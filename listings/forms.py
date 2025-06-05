# listings/forms.py
from django import forms
from .models import Room

class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = [
            'title', 'description', 'price', 'city', 'address',
            'available_from', 'available_to', 'image'
        ]
        widgets = {
            'available_from': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'available_to': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
        }
