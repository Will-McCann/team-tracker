from django.urls import path
from .views import TeamListCreateView

urlpatterns = [
    path('teams/', TeamListCreateView.as_view(), name='teams'),
]