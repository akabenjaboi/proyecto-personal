from django.shortcuts import render, redirect, get_object_or_404
from .models import Review
from .forms import ReviewForm
from listings.models import Room
from django.contrib.auth.decorators import login_required
from booking.models import Booking  # Asegúrate de importar el modelo de reservas
from django.contrib import messages

@login_required
def add_review(request, room_id):
    room = get_object_or_404(Room, pk=room_id)
    # Solo permitir si el usuario tiene una reserva aprobada en esta habitación
    has_approved_booking = Booking.objects.filter(
        room=room,
        student=request.user,  # Cambiado de 'user' a 'student'
        status='approved'      # Ajusta si tu valor es diferente
    ).exists()
    if not has_approved_booking:
        messages.error(request, "Solo puedes dejar una valoración si tuviste una reserva aprobada en esta habitación.")
        return redirect('listings:room_detail', pk=room_id)
    if Review.objects.filter(room=room, user=request.user).exists():
        return redirect('listings:room_detail', pk=room_id)
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.room = room
            review.user = request.user
            review.save()
            return redirect('listings:room_detail', pk=room_id)
    else:
        form = ReviewForm()
    return render(request, 'reviews/review_form.html', {'form': form, 'room': room})
