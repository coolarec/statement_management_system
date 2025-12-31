from django.db import models
from core.user.user_model import User

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.name

class Problem(models.Model):
    DIFFICULTY_CHOICES = [(i, f"{i}星") for i in range(1, 6)]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    input_description = models.TextField(blank=True, null=True)
    output_description = models.TextField(blank=True, null=True)
    analysis = models.TextField(blank=True, null=True)
    difficulty = models.IntegerField(choices=DIFFICULTY_CHOICES, default=3)
    is_public = models.BooleanField(default=True)  # <-- 新增：是否在公共题库
    
    tags = models.ManyToManyField(Tag, blank=True, related_name="problems")
    problem_setter = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Example(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="examples")
    input_data = models.TextField()
    output_data = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="test_cases")
    input_file = models.FileField(upload_to="test_inputs/")
    expected_output = models.TextField()
    data_type = models.CharField(max_length=50, default="string")
    weight = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

class Solution(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name="solutions")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.TextField()
    language = models.CharField(max_length=50, default="Python")
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)