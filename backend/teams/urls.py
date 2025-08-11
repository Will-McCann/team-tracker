from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views, auth_views

urlpatterns = [
    # Teams endpoints
    path('teams/', views.TeamListCreateView.as_view()),
    path('teams/<int:pk>/', views.TeamRetrieveUpdateDeleteView.as_view()),

    # Friends endpoints
    path('friends/', views.FriendListView.as_view(), name='friend-list'),
    path('friends/add/', views.AddFriendView.as_view(), name='add-friend'),
    path('friends/remove/', views.RemoveFriendView.as_view(), name='remove-friend'),
    path('friends/<int:user_id>/teams/', views.FriendTeamListView.as_view(), name='friend-teams'),

    # Auth endpoints
    path('auth/signup/', auth_views.signup),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]