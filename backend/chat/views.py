from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import openai
import os
from dotenv import load_dotenv
from user.models import User


from .models import Chat, Message
from .serializers import (
    ChatMessageSerializer,
    ChatResponseSerializer,
    MessageSerializer,
    ChatSerializer,
)

load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")


# https://pypi.org/project/openai/
class ChatGPT(APIView):
    # permission_classes = [IsAuthenticated]
    # print("authenticated status: ",IsAuthenticated)

    def post(self, request, format=None):
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            request_message = serializer.validated_data.get('message', None)
            chat_id = serializer.validated_data.get('chat_id', None)

            print(request_message)
            print("Api key: ",openai.api_key)
            print("Chat id: ",chat_id)

            print("Request user: ",request)

            if chat_id:
                chat = Chat.objects.get(id=chat_id)
            else:
                owner_id = serializer.validated_data.get('owner', None)
                owner = User.objects.get(id=owner_id)
                print("Owner: ",owner)
                chat = Chat.objects.create(owner=owner)

            if not request_message:
                serializer = ChatSerializer(chat)
                return Response(serializer.data)

            user_message_obj = Message(content=request_message, role=Message.Role.USER, chat=chat)
            user_message_obj.save()
            print("User message object:", user_message_obj )

            messages = Message.objects.filter(chat=chat).order_by('timestamp')
            message_list = []
            for message in messages:
                role = message.role
                message_list.append({"role": role, "content": message.content})

            message_list.append({"role": "user", "content": request_message})
            print("Message list: ",message_list)

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=message_list
            )

            print(response)
            ai_message = response.choices[0].message['content'].strip()
            print(ai_message)

            ai_message_obj = Message(content=ai_message, role=Message.Role.ASSISTANT, chat=chat)
            ai_message_obj.save()

            response_serializer = ChatResponseSerializer(data={"message": ai_message})
            if response_serializer.is_valid():
                return Response({"message": response_serializer.validated_data["message"], "chat_id": chat.id})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, chat_id=None, format=None):
        if chat_id:
            chat = Chat.objects.get(pk=chat_id)
            messages = Message.objects.filter(chat=chat).order_by('timestamp')
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        else:
            chats = Chat.objects.all().order_by('-created_at')
            serializer = ChatSerializer(chats, many=True)
            return Response(serializer.data)
