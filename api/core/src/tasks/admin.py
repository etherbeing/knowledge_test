from django.contrib import admin
from tasks.models import Comment, Task, TaskCategory

# Register your models here.


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    pass


@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class TaskCommentAdmin(admin.ModelAdmin):
    pass
