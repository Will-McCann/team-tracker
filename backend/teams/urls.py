from django.urls import path
from .views import TeamListCreateView, TeamRetrieveUpdateDeleteView

urlpatterns = [
    path('teams/', TeamListCreateView.as_view(), name='teams'),
    path('teams/<int:pk>/', TeamRetrieveUpdateDeleteView.as_view(), name='team-detail'),
]