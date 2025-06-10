# listings/forms.py
from django import forms
from .models import Room, RoomImage

class RoomForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = [
            'title', 'description', 'price', 'city', 'address',
            'available_from', 'available_to'
        ]  # <-- NO incluyas 'image'
        widgets = {
            'available_from': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
            'available_to': forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
        }

class RoomImageForm(forms.ModelForm):
    image = forms.ImageField(label='Imagen', required=False)
    class Meta:
        model = RoomImage
        fields = ['image']
