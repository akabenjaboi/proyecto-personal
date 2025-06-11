from rest_framework import serializers
from .models import Room

class RoomSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Room
        fields = '__all__'