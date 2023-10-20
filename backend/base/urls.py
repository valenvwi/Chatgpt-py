from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from chat.views import ChatListView, ChatMessageView
from rest_framework.routers import DefaultRouter
from user.views import (
    JWTCookieTokenObtainPairView,
    JWTCookieTokenRefreshView,
    LogOutAPIView,
    RegisterView,
)
from user.views import UserViewSet
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register("api/users", UserViewSet, basename="user")


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/docs/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/schema/ui/", SpectacularSwaggerView.as_view()),
    path('api/chats/', ChatListView.as_view(), name='chat_history'),
    path('api/chats/<str:chat_id>/', ChatMessageView.as_view(), name='chat_messages'),
    path("api/token/", JWTCookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", JWTCookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogOutAPIView.as_view(), name="logout"),
    path("api/register/", RegisterView.as_view(), name="register"),
] + router.urls

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
