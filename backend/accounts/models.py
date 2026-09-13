from django.db import models

# Create your models here.

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    is_doctor = models.BooleanField(default=True)  # for future role-based access
