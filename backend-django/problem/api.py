from django.db import transaction
from django.db.models import Q  # 必须导入 Q 对象
from django.shortcuts import get_object_or_404
from ninja import Router
from typing import List
from .models import Tag, Problem, Example, Solution
from .schemas import ProblemCreateIn, ProblemListOut, ProblemDetailOut, TagOut,SolutionOut,SolutionIn

router = Router(tags=["Problems"])

@router.post("/", response=ProblemDetailOut)
def create_problem(request, payload: ProblemCreateIn):
    data = payload.dict()
    tag_ids = data.pop('tag_ids', [])
    examples_data = data.pop('examples', [])
    
    # 使用事务保证 Problem 和 Example 同时成功
    with transaction.atomic():
        problem = Problem.objects.create(problem_setter=request.auth, **data)
        
        if tag_ids:
            problem.tags.set(Tag.objects.filter(id__in=tag_ids))
            
        if examples_data:
            Example.objects.bulk_create([
                Example(problem=problem, **ex) for ex in examples_data
            ])
            
    return problem

@router.get("/", response=List[ProblemListOut])
def list_problems(request):
    # 基础查询集，使用 prefetch_related 优化 M2M 性能
    queryset = Problem.objects.prefetch_related('tags').order_by('-created_at')

    # 1. 如果是管理员 (is_staff)，直接返回所有题目
    if request.auth.USER_TYPE_CHOICES==0 or request.auth.USER_TYPE_CHOICES==1:
        return queryset.all()

    # 2. 如果是普通登录用户：
    # 逻辑：(是公开题目) OR (出题人是当前用户)
    else :
        return queryset.filter(
            Q(is_public=True) | Q(problem_setter=request.auth)
        )

@router.get("/tags/all", response=List[TagOut])
def list_tags(request):
    return Tag.objects.all()



@router.post("/{problem_id}/solutions", response=SolutionOut)
def create_solution(request, problem_id: int, payload: SolutionIn):
    problem = get_object_or_404(Problem, id=problem_id)
    solution = Solution.objects.create(
        problem=problem,
        user=request.auth, # 确保已登录
        **payload.dict()
    )
    return solution