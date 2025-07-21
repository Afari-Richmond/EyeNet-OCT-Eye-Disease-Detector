from django.shortcuts import render

# Create your views here.
from rest_framework.views import api_view
from rest_framework.response import Response 

@api_view(['GET']):
def hello(request):
    return Response({"message": "Hello from the DRF server!"})

