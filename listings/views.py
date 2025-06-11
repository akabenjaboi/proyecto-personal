from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.db.models import Avg
from django.forms import modelformset_factory

# Create your views here.
# listings/views.py
from .models import Room, RoomImage
from .forms import RoomForm, RoomImageForm
from booking.models import Booking
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework import status
from .serializers import RoomSerializer
from rest_framework import viewsets

def room_list(request):
    rooms = Room.objects.filter(owner=request.user)
    return render(request, 'listings/room_list.html', {'rooms': rooms})

def room_detail(request, pk):
    room = get_object_or_404(Room, pk=pk)
    already_booked = False
    if request.user.is_authenticated:
        already_booked = Booking.objects.filter(
            room=room,
            student=request.user,
            status__in=['pending', 'approved'],
            # Si filtras por fechas, asegúrate de que sea correcto
        ).exists()
    average_rating = room.reviews.aggregate(Avg('rating'))['rating__avg']
    user_reviewed = False
    if request.user.is_authenticated:
        user_reviewed = room.reviews.filter(user=request.user).exists()
    approved_booking = room.bookings.filter(status='approved').first()
    can_view = not room.archived or request.user == room.owner or (approved_booking and approved_booking.student == request.user)
    if not can_view:
        return redirect('listings:room_list')
    return render(request, 'listings/room_detail.html', {
        'room': room,
        'already_booked': already_booked,
        'average_rating': average_rating,
        'user_reviewed': user_reviewed,
    })

@login_required
def room_create(request):
    RoomImageFormSet = modelformset_factory(RoomImage, form=RoomImageForm, extra=4, max_num=4)
    if request.method == 'POST':
        form = RoomForm(request.POST)
        formset = RoomImageFormSet(request.POST, request.FILES, queryset=RoomImage.objects.none())
        if form.is_valid() and formset.is_valid():
            room = form.save(commit=False)
            room.owner = request.user
            room.save()
            for image_form in formset:
                if image_form.cleaned_data.get('image'):
                    RoomImage.objects.create(room=room, image=image_form.cleaned_data['image'])
            return redirect('listings:room_detail', pk=room.pk)
    else:
        form = RoomForm()
        formset = RoomImageFormSet(queryset=RoomImage.objects.none())
    return render(request, 'listings/room_form.html', {'form': form, 'formset': formset})

@login_required
def room_update(request, pk):
    room = get_object_or_404(Room, pk=pk)
    if request.method == 'POST':
        form = RoomForm(request.POST, request.FILES, instance=room)
        if form.is_valid():
            form.save()
            return redirect('listings:room_detail', pk=room.pk)
    else:
        form = RoomForm(instance=room)
    return render(request, 'listings/room_update.html', {'form': form, 'room': room})

@login_required
def room_delete(request, pk):
    room = get_object_or_404(Room, pk=pk)
    if request.method == 'POST':
        room.delete()
        return redirect('accounts:profile')  # Redirige al perfil después de eliminar
    return render(request, 'listings/room_confirm_delete.html', {'room': room})

@login_required
def room_archive(request, pk):
    room = get_object_or_404(Room, pk=pk, owner=request.user)
    room.archived = not room.archived  # Alterna el estado
    room.save()
    return redirect('accounts:profile')

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
def room_list_create_api(request):
    if request.method == 'GET':
        rooms = Room.objects.all()  # <-- Asegúrate de que NO filtra por archived=False
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
def room_detail_api(request, pk):
    try:
        room = Room.objects.get(pk=pk)
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = RoomSerializer(room)
        return Response(serializer.data)
    elif request.method == 'PUT':
        # Solo el dueño puede editar
        if room.owner != request.user:
            return Response({'detail': 'No tienes permiso para editar esta habitación.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = RoomSerializer(room, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        if room.owner != request.user:
            return Response({'detail': 'No tienes permiso para eliminar esta habitación.'}, status=status.HTTP_403_FORBIDDEN)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def public_room_list(request):
    rooms = Room.objects.filter(archived=False)
    serializer = RoomSerializer(rooms, many=True)
    return Response(serializer.data)
