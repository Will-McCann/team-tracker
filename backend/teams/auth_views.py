from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken.'}, status=status.HTTP_400_BAD_REQUEST)

    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)