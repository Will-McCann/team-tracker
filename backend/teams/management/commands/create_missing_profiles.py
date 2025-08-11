from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from teams.models import UserProfile

class Command(BaseCommand):
    help = 'Create UserProfile for users that do not have one'

    def handle(self, *args, **kwargs):
        users_without_profile = User.objects.filter(profile__isnull=True)
        count = users_without_profile.count()
        if count == 0:
            self.stdout.write(self.style.SUCCESS('All users already have profiles.'))
            return

        for user in users_without_profile:
            UserProfile.objects.create(user=user)
            self.stdout.write(f'Created profile for user: {user.username}')

        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} profiles.'))
