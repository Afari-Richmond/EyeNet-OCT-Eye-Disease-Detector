from rest_framework import serializers
from .models import Patient, Scan


# Define the serializer to handle file uploads from the frontend
class PredictionSerializer(serializers.Serializer):
    image = serializers.ImageField()


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["id", "full_name", "date_of_birth", "notes", "created_at"]
        read_only_fields = ["id", "created_at"]


class ScanSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(
        source="patient.full_name", read_only=True, default=None
    )

    class Meta:
        model = Scan
        fields = [
            "id",
            "patient",
            "patient_name",
            "prediction",
            "confidence",
            "report_generated",
            "created_at",
        ]
        read_only_fields = ["id", "prediction", "confidence", "created_at"]


class ScanReportGeneratedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ["id", "report_generated"]
        read_only_fields = ["id"]
