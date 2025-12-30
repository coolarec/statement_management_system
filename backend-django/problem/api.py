from ninja import Router

router = Router(tags=["Problem"])

@router.get("/list",auth=None)
def list_problem(request):
    return {"msg": "problem list"}
