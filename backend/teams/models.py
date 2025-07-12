from django.db import models

class Team(models.Model):
    name = models.CharField(max_length=100)
    generation = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Pokemon(models.Model):
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=100, default=None)
    level = models.PositiveIntegerField(default=1)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='pokemon', default=None)

    def __str__(self):
        return f"{self.name} (Lv. {self.level})"
