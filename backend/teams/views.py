from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .serializers import TeamSerializer, UserProfileSerializer, FriendWithTeamsSerializer
from .models import Team
from django.contrib.auth.models import User

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
    
class AddFriendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        friend_username = request.data.get("username")
        if not friend_username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend_user = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if friend_user == request.user:
            return Response({"error": "You cannot add yourself as a friend"}, status=status.HTTP_400_BAD_REQUEST)

        request.user.profile.friends.add(friend_user.profile)
        return Response({"message": f"{friend_username} added as a friend"}, status=status.HTTP_200_OK)
    
class RemoveFriendView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        friend_username = request.data.get("username")
        try:
            friend_user = User.objects.get(username=friend_username)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        request.user.profile.friends.remove(friend_user.profile)
        return Response({"detail": "Friend removed"}, status=status.HTTP_200_OK)

class FriendListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)
    
class FriendTeamListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        try:
            friend_profile = request.user.profile.friends.get(user__id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "Friend not found"}, status=status.HTTP_404_NOT_FOUND)

        teams = Team.objects.filter(user=friend_profile.user).prefetch_related("pokemon")
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
