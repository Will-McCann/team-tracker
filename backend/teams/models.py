from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Team(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='teams', null=True, blank=True)
    name = models.CharField(max_length=100)
    generation = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    isFavorite = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Pokemon(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    species = models.CharField(max_length=100, default=None)
    level = models.PositiveIntegerField(default=1)
    apiId = models.PositiveIntegerField(blank=True, null=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='pokemon', default=None)

    def __str__(self):
        return f"{self.name} (Lv. {self.level})"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)

    def __str__(self):
        return self.user.username
    
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()