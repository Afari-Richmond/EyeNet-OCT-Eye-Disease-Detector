from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import tensorflow as tf
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
from tensorflow.keras.utils import load_img, img_to_array
import numpy as np
import tempfile

#from .recommendation import cnv, dme, drusen, normal

class PredictDiseaseView(APIView):
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
            # Load model
            model = tf.keras.models.load_model("Trained_Model.h5", compile=False)

            # Preprocess image
            img = load_img(temp_path, target_size=(224, 224))
            x = img_to_array(img)
            x = np.expand_dims(x, axis=0)
            x = preprocess_input(x)

            # Predict
            predictions = model.predict(x)
            predicted_index = int(np.argmax(predictions))
            confidence = float(np.max(predictions))

            class_names = ['CNV', 'DME', 'DRUSEN', 'NORMAL']
            #recommendations = [cnv, dme, drusen, normal]

            if confidence < 0.5:
                return Response({
                    "warning": "Low confidence prediction. Please try another image.",
                    "confidence": confidence
                }, status=status.HTTP_200_OK)

            return Response({
                "prediction": class_names[predicted_index],
                "confidence": round(confidence * 100, 2),
                #"recommendation": recommendations[predicted_index]
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
