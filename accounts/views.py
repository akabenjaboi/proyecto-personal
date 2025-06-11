from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import CustomUserCreationForm
from .models import User
from listings.models import Room
from booking.models import Booking
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

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

# Listar todos los usuarios o crear uno nuevo (registro)
@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def user_list_create_api(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Ver, actualizar o eliminar un usuario específico
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_detail_api(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
