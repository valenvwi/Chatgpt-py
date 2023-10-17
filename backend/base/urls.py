from django.contrib import admin
from django.urls import path
import chat.views as views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chats/', views.ChatGPT.as_view(), name='chat_history'),
    path('api/chats/<str:chat_id>/', views.ChatGPT.as_view(), name='chat_messages'),
]
