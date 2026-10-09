from django.contrib import admin
from .models import Patient, Scan

admin.site.register(Patient)
admin.site.register(Scan)
