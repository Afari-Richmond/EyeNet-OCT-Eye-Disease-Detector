from django.db import models

# Create your models here.
from django.db import models

class Diagnosis(models.Model):
    patient_name = models.CharField(max_length=100)
    prediction = models.CharField(max_length=50)
    confidence = models.FloatField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.prediction} ({self.confidence}%)"
