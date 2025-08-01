from http import HTTPMethod

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from security.models import User
from security.serializers import UserSerializer


class SecurityViewSet(GenericViewSet):
    permission_classes = [IsAuthenticated]

    def get_object(self):  # type: ignore
        return self.request.user

    def get_queryset(self):  # type: ignore
        if self.action == self.get_current_user.__name__:
            return User.objects.filter(
                pk=self.request.user.pk
            )  # just to have a standard API useless actually
        else:
            return User.objects.none()

    def get_serializer_class(self):  # type: ignore
        if self.action == self.get_current_user.__name__:
            return UserSerializer
        else:
            return super().get_serializer_class()

    @action(
        [HTTPMethod.GET],
        detail=False,
        url_path="user",
        permission_classes=[IsAuthenticated],
    )
    def get_current_user(self, request: Request):
        return Response(
            data=self.get_serializer(instance=self.get_object(), many=False).data
        )
