from django.urls import path
from .views import PredictDiseaseView

urlpatterns = [
    path('predict-scan/', PredictDiseaseView.as_view(), name='predict-scan'),
]
