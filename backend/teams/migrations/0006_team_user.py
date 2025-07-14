from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


def assign_default_user(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Team = apps.get_model('teams', 'Team')

    default_user, created = User.objects.get_or_create(username='defaultuser')
    for team in Team.objects.all():
        team.user = default_user
        team.save()


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0005_team_isfavorite'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='team',
            name='user',
            field=models.ForeignKey(
                to=settings.AUTH_USER_MODEL,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='teams',
                null=True,  # Temporarily allow NULL
                blank=True
            ),
        ),
        migrations.RunPython(assign_default_user),
        migrations.AlterField(
            model_name='team',
            name='user',
            field=models.ForeignKey(
                to=settings.AUTH_USER_MODEL,
                on_delete=django.db.models.deletion.CASCADE,
                related_name='teams',
                null=False,
                blank=False
            ),
        ),
    ]
