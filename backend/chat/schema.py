from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .serializers import ChatSerializer

chat_list_docs = extend_schema(
    responses = ChatSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="by_userId",
            type=OpenApiTypes.NUMBER,
            location=OpenApiParameter.QUERY,
            description="Filter chats by user id",
        ),
    ],
)
