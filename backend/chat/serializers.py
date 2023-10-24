from rest_framework import serializers
from .models import Chat, Message
from user.serializers import UserSerializer

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ChatMessageSerializer(serializers.Serializer):
    chat_id = serializers.UUIDField(required=False)
    message = serializers.CharField(required=True)
    owner = serializers.CharField(required=False)


class ChatResponseSerializer(serializers.Serializer):
    message = serializers.CharField()
