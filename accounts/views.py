from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import CustomUserCreationForm
from .models import User
from listings.models import Room
from booking.models import Booking

def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')  # Cambiado de 'profile' a 'home'
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')  # Cambiado de 'profile' a 'home'
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('accounts:login')


#se pasa room como variable para que se pueda usar en la plantilla
def home_view(request):
    rooms = Room.objects.all()
    return render(request, 'base/home.html', {'rooms': rooms})

@login_required
def profile_view(request):
    user_rooms = Room.objects.filter(owner=request.user)
    my_bookings = Booking.objects.filter(student=request.user)
    # Crea un diccionario con el booking aprobado para cada room
    approved_bookings = {
        room.pk: room.bookings.filter(status='approved').first()
        for room in user_rooms
    }
    return render(request, 'accounts/profile.html', {
        'user': request.user,
        'user_rooms': user_rooms,
        'my_bookings': my_bookings,
        'approved_bookings': approved_bookings,
    })

@login_required
def editProfile_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Perfil actualizado correctamente.')
            return redirect('accounts:profile')  # Corregido: usa el namespace
    else:
        form = CustomUserCreationForm(instance=request.user)
    return render(request, 'accounts/editProfile.html', {'form': form})
