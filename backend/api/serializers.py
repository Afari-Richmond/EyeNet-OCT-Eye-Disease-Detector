from  rest_framework import serializers


# Define the serializser to handle file uplaods from the frontend
class PredictionSerializer(serializers.Serializer):
    image = serializers.ImageField()