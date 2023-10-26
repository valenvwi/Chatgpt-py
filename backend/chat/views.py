from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import openai
import os
from dotenv import load_dotenv
from user.models import User


from .models import Chat, Message
from .schema import chat_list_docs
from .serializers import (
    ChatMessageSerializer,
    ChatResponseSerializer,
    MessageSerializer,
    ChatSerializer,
)

load_dotenv()
openai.api_key = os.environ.get("OPENAI_API_KEY")


class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    @chat_list_docs
    def get(self, request, chat_id=None, format=None):
        chats = Chat.objects.filter(owner=request.user).order_by('-created_at')

        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

    def post(self,request, format=None):
        serializer = ChatSerializer(data=request.data)
        if serializer.is_valid():
            chat = Chat.objects.create(owner=request.user)
            chat.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)



# https://pypi.org/project/openai/
class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, chat_id=None, format=None):
        if chat_id:
            chat = Chat.objects.get(pk=chat_id)
            messages = Message.objects.filter(chat=chat).order_by('timestamp')
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)

    def post(self, request, chat_id=None, format=None):
        serializer = ChatMessageSerializer(data=request.data)

        if serializer.is_valid():
            request_message = serializer.validated_data.get('message', None)
            chat_id = serializer.validated_data.get('chat_id', None)

            if chat_id:
                chat = Chat.objects.get(id=chat_id)
                print("Chat: ",chat)
            else:
                chat = Chat.objects.create(owner=request.user)

            if not request_message:
                serializer = ChatSerializer(chat)
                return Response(serializer.data)

            user_message_obj = Message(content=request_message, role=Message.Role.USER, chat=chat)
            user_message_obj.save()

            messages = Message.objects.filter(chat=chat).order_by('timestamp')
            # print("Messages: ",messages)

            message_list = [{"role": "system", "content": "You are Thomas, a chatbot that reluctantly answers questions with sarcastic responses. You are cool with attitude but also provide useful response. When the user ask you to tell a joke, you will tell them a joke related to food and emoji at the end."}]

            for message in messages:
                message_list.append({"role": message.role, "content": message.content})

            # print("Message List append: ",message_list)

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=message_list,
                temperature=0.5,
                max_tokens=150,
            )


            print("AI Message response: ",response)

            ai_message = response.choices[0].message.content.strip()

            ai_message_obj = Message(content=ai_message, role=Message.Role.ASSISTANT, chat=chat)
            ai_message_obj.save()

            response_serializer = ChatResponseSerializer(data={"message": ai_message})
            if response_serializer.is_valid():
                return Response({"message": response_serializer.validated_data["message"], "chat_id": chat.id})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
