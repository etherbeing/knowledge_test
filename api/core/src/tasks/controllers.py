from http import HTTPMethod
from typing import override

from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from rest_framework.viewsets import GenericViewSet
from tasks.models import Task
from tasks.serializers import TaskSerializer


class TODOViewSet(GenericViewSet):
    def get_object(self):
        return super().get_object()

    def get_queryset(self):  # type: ignore
        if self.action == self.get_tasks.__name__:
            return Task.objects.filter(owner=self.request.user)
        else:
            return Task.objects.none()

    def get_serializer_class(self):  # type: ignore
        if self.action in [
            self.get_tasks.__name__,
            self.create_task.__name__,
            self.update_task.__name__,
            self.delete_task.__name__,
        ]:
            return TaskSerializer
        else:
            return super().get_serializer_class()

    @action([HTTPMethod.GET], detail=False, url_path="tasks")
    def get_tasks(self, request: Request):
        return Response(
            data=self.get_serializer(instance=self.get_queryset(), many=True).data
        )

    @action([HTTPMethod.POST], detail=False, url_path="tasks/create")
    def create_task(self, request: Request):
        print(request.data)
        serializer = self.get_serializer(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response()

    @action([HTTPMethod.PATCH], detail=True, url_path="tasks/update")
    def update_task(self, request: Request, pk: int):
        task = Task.objects.filter(pk=pk)
        if not task.exists():
            raise NotFound()
        serializer = self.get_serializer(data=request.data, instance=task, many=False)
        serializer.is_valid(raise_exception=True)
        serializer.update()
        return Response()

    @action([HTTPMethod.DELETE], detail=True, url_path="tasks/delete")
    def delete_task(self, request: Request, pk: int):
        task = Task.objects.filter(pk=pk)
        if not task.exists():
            raise NotFound()
        task.delete()
        return Response()
