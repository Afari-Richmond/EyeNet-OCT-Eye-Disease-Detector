from  rest_framework import serializers
from .models import Diagnosis


# Define the serializser to handle file uplaods from the frontend
class PredictionSerializer(serializers.Serializer):
    image = serializers.ImageField()


class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = '__all__'