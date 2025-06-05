from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from listings.models import Room
from .models import Booking
from .forms import BookingForm

@login_required
def booking_create(request, room_id):
    room = get_object_or_404(Room, pk=room_id)
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            start = form.cleaned_data['start_date']
            end = form.cleaned_data['end_date']
            overlap = Booking.objects.filter(
                room=room,
                status='approved',
                start_date__lt=end,
                end_date__gt=start
            ).exists()
            if overlap:
                form.add_error(None, "La habitación ya está reservada en esas fechas.")
            else:
                booking = form.save(commit=False)
                booking.student = request.user
                booking.room = room
                booking.save()
                return redirect('booking:booking_detail', pk=booking.pk)
    else:
        form = BookingForm()
    return render(request, 'booking/booking_form.html', {'form': form, 'room': room})

@login_required
def booking_detail(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    return render(request, 'booking/booking_detail.html', {'booking': booking})

@login_required
def booking_list(request):
    my_bookings = Booking.objects.filter(student=request.user)
    return render(request, 'booking/booking_list.html', {'my_bookings': my_bookings})

@login_required
def booking_approve(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    if request.method == 'POST' and booking.room.owner == request.user:
        # Bloquea fechas: rechaza otras pendientes/aceptadas que se solapen
        Booking.objects.filter(
            room=booking.room,
            status='approved',
            start_date__lt=booking.end_date,
            end_date__gt=booking.start_date
        ).update(status='rejected')
        booking.status = 'approved'
        booking.save()
    return redirect('accounts:profile')

@login_required
def booking_reject(request, pk):
    booking = get_object_or_404(Booking, pk=pk)
    if request.method == 'POST' and booking.room.owner == request.user:
        booking.status = 'rejected'
        booking.save()
    return redirect('accounts:profile')

@login_required
def booking_update(request, pk):
    booking = get_object_or_404(Booking, pk=pk, student=request.user)
    if booking.status != 'pending':
        return redirect('booking:booking_list')
    if request.method == 'POST':
        form = BookingForm(request.POST, instance=booking)
        if form.is_valid():
            form.save()
            return redirect('booking:booking_list')
    else:
        form = BookingForm(instance=booking)
    return render(request, 'booking/booking_form.html', {'form': form, 'room': booking.room, 'update': True})

@login_required
def booking_delete(request, pk):
    booking = get_object_or_404(Booking, pk=pk, student=request.user)
    if request.method == 'POST':
        booking.delete()
        return redirect('booking:booking_list')
    return render(request, 'booking/booking_confirm_delete.html', {'booking': booking})
