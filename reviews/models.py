from django.db import models
from django.conf import settings
from listings.models import Room

class Review(models.Model):
    room = models.ForeignKey(Room, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('room', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f'Review {self.rating} by {self.user} for {self.room}'
