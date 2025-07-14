from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views, auth_views

urlpatterns = [
    # Teams endpoints
    path('teams/', views.TeamListCreateView.as_view()),
    path('teams/<int:pk>/', views.TeamRetrieveUpdateDeleteView.as_view()),

    # Auth endpoints
    path('auth/signup/', auth_views.signup),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]