from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .serializers import TeamSerializer
from .models import Team

class TeamListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        teams = Team.objects.filter(user=request.user).prefetch_related('pokemon')
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TeamSerializer(data=request.data)
        if serializer.is_valid():
            team = serializer.save(user=request.user)
            return Response(TeamSerializer(team).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TeamRetrieveUpdateDeleteView(RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TeamSerializer

    def get_queryset(self):
        return Team.objects.filter(user=self.request.user)