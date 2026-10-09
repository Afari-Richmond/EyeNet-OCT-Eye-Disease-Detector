# import the necessary libraries for the API
import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np
import tempfile

from .models import Patient, Scan
from .serializers import PatientSerializer, ScanSerializer, ScanReportGeneratedSerializer

MODEL_PATH = os.environ.get("MODEL_PATH", "Trained_Model.h5")

# Loaded once per worker process at import time, instead of on every
# request - repeatedly deserializing a 66MB model was crashing the
# worker under Render's free-tier 512MB memory limit.
_model = tf.keras.models.load_model(MODEL_PATH, compile=False)

class PredictDiseaseView(APIView):
    # Explicitly AllowAny (already the DRF default) so it's clear guests
    # are meant to be able to predict without an account.
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        image_file = request.FILES.get('image')

        if not image_file:
            return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

        # Save image to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            for chunk in image_file.chunks():
                tmp.write(chunk)
            temp_path = tmp.name

        try:
            # Preprocess image
            img = load_img(temp_path, target_size=(224, 224))
            x = img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)

            # Predict
            predictions = _model.predict(x)
            predicted_index = int(np.argmax(predictions))
            confidence = float(np.max(predictions))

            class_names = ['CNV', 'DME', 'DRUSEN', 'NORMAL']

            if confidence < 0.5:
                return Response({
                    "warning": "Low confidence prediction. Please try another image.",
                    "confidence": round(confidence * 100, 2)
                }, status=status.HTTP_200_OK)

            prediction = class_names[predicted_index]
            confidence_pct = round(confidence * 100, 2)
            scan_id = None

            if request.user and request.user.is_authenticated:
                patient = None
                patient_id = request.data.get('patient_id')
                if patient_id:
                    patient = Patient.objects.filter(id=patient_id, doctor=request.user).first()
                scan = Scan.objects.create(
                    doctor=request.user,
                    patient=patient,
                    prediction=prediction,
                    confidence=confidence_pct,
                )
                scan_id = scan.id

            return Response({
                "prediction": prediction,
                "confidence": confidence_pct,
                "scan_id": scan_id,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Patient.objects.filter(doctor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Patient.objects.filter(doctor=self.request.user)


class PatientScansView(generics.ListAPIView):
    serializer_class = ScanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scan.objects.filter(patient_id=self.kwargs['pk'], doctor=self.request.user)


class ScanListView(generics.ListAPIView):
    serializer_class = ScanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Scan.objects.filter(doctor=self.request.user)
        report_generated = self.request.query_params.get('report_generated')
        if report_generated is not None:
            queryset = queryset.filter(report_generated=report_generated.lower() == 'true')
        return queryset


class ScanDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ScanReportGeneratedSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Scan.objects.filter(doctor=self.request.user)
