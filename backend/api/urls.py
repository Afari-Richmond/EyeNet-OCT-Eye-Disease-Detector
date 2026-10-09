from django.urls import path
from .views import (
    PredictDiseaseView,
    PatientListCreateView,
    PatientDetailView,
    PatientScansView,
    ScanListView,
    ScanDetailView,
)

urlpatterns = [
    path('predict-scan/', PredictDiseaseView.as_view(), name='predict-scan'),
    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patients/<int:pk>/scans/', PatientScansView.as_view(), name='patient-scans'),
    path('scans/', ScanListView.as_view(), name='scan-list'),
    path('scans/<int:pk>/', ScanDetailView.as_view(), name='scan-detail'),
]
