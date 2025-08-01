from django.db import models

# Create your models here.


class Comment(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    message = models.CharField(default=None)
    reply_to = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True
    )

    def __str__(self) -> str:
        return self.message[:10]

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"


class TaskCategory(models.Model):
    title = models.CharField(default=None)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Task(models.Model):
    title = models.CharField(default=None)
    description = models.CharField(null=True, blank=True, default=None)
    owner = models.ForeignKey("security.User", on_delete=models.CASCADE, default=None)
    category = models.ForeignKey(TaskCategory, on_delete=models.PROTECT, default=None)
    comments = models.ManyToManyField(Comment, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "Task"
        verbose_name_plural = "Tasks"
