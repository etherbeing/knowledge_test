from crum import get_current_user
from rest_framework.exceptions import NotAcceptable, NotFound
from rest_framework.serializers import ModelSerializer
from security.serializers import UserSerializer
from tasks.models import Comment, Task, TaskCategory


class CategorySerializer(ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = "__all__"


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"


class TaskSerializer(ModelSerializer):
    comments = CommentSerializer(many=True, required=False, read_only=True)
    owner = UserSerializer(read_only=True)
    category = CategorySerializer()

    def create(self, validated_data):
        category = validated_data.pop("category", {})
        print(validated_data)
        task = Task(**validated_data)
        try:
            task.category = TaskCategory.objects.get_or_create(
                title=category.get("title")
            )[0]
        except TaskCategory.DoesNotExist:
            raise NotFound("Task category not found")
        task.owner = get_current_user()  # type: ignore
        try:
            task.save()
        except Exception:
            raise NotAcceptable()
        return task

    class Meta:
        model = Task
        fields = "__all__"
