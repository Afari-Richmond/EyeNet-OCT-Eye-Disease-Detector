from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import CustomLoginSerializer

from .serializers import RegisterSerializer

# Registration View with success message
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            "message": "Registration successful!",
            "email": serializer.data.get("email"),
            "username": serializer.data.get("username")
        }, status=status.HTTP_201_CREATED)

# Custom Login View (optional customization)
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # You can add custom claims here
        token['username'] = user.username
        return token

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer