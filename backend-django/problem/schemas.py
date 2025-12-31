from typing import List, Optional
from ninja import Schema, ModelSchema
from .models import Tag, Problem, Example, TestCase, Solution

# --- Tag ---
class TagOut(ModelSchema):
    class Meta:
        model = Tag
        fields = ['id', 'name']

# --- Example ---
class ExampleSchema(Schema):
    input_data: str
    output_data: str

# --- Problem ---
class ProblemListOut(ModelSchema):
    tags: List[TagOut]
    class Meta:
        model = Problem
        fields = ['id', 'title', 'difficulty', 'is_public', 'created_at']

class ProblemDetailOut(ModelSchema):
    tags: List[TagOut]
    examples: List[ExampleSchema] = [] 
    class Meta:
        model = Problem
        fields = [
            'id', 'title', 'description', 'input_description', 
            'output_description', 'analysis', 'difficulty', 'is_public', 'created_at'
        ]

class ProblemCreateIn(Schema):
    title: str
    description: str
    input_description: Optional[str] = None
    output_description: Optional[str] = None
    analysis: Optional[str] = None
    difficulty: int = 3
    is_public: bool = True
    tag_ids: List[int] = []
    examples: List[ExampleSchema] = [] # 支持创建时直接传入样例

# --- TestCase & Solution (保留原有) ---
class TestCaseOut(ModelSchema):
    class Meta:
        model = TestCase
        fields = ['id', 'data_type', 'weight', 'created_at']

class SolutionOut(ModelSchema):
    user_name: str = None
    class Meta:
        model = Solution
        fields = ['id', 'language', 'code', 'description', 'created_at']
    
    @staticmethod
    def resolve_user_name(obj):
        return obj.user.username

class SolutionIn(Schema):
    language: str
    code: str
    description: Optional[str] = None