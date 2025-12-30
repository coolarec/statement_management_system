from django.db import models

class Test(models.Model):
    name = models.CharField(max_length=50)
    value = models.IntegerField()

    class Meta:
        db_table = "test"
