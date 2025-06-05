from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render

# Create your views here.
# listings/views.py
from .models import Room
from .forms import RoomForm
from booking.models import Booking

def room_list(request):
    rooms = Room.objects.filter(archived=False)
    return render(request, 'listings/room_list.html', {'rooms': rooms})

def room_detail(request, pk):
    room = get_object_or_404(Room, pk=pk)
    approved_booking = room.bookings.filter(status='approved').first()
    can_view = not room.archived or request.user == room.owner or (approved_booking and approved_booking.student == request.user)
    if not can_view:
        return redirect('listings:room_list')
    already_booked = False
    if request.user.is_authenticated and request.user != room.owner:
        already_booked = Booking.objects.filter(student=request.user, room=room).exists()
    return render(request, 'listings/room_detail.html', {
        'room': room,
        'already_booked': already_booked,
    })

@login_required
def room_create(request):
    if request.method == 'POST':
        form = RoomForm(request.POST, request.FILES)
        if form.is_valid():
            room = form.save(commit=False)
            room.owner = request.user
            room.save()
            return redirect('listings:room_detail', pk=room.pk)  # Usa el namespace 'listings'
    else:
        form = RoomForm()
    return render(request, 'listings/room_form.html', {'form': form})

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
