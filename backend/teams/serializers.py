from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Team, Pokemon, UserProfile

class PokemonSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Pokemon
        fields = ['name', 'species', 'level', 'apiId']

class TeamSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer(many=True)
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'user', 'name', 'generation', 'description', 'pokemon', 'isFavorite']

    def create(self, validated_data):
        pokemon_data = validated_data.pop('pokemon')
        team = Team.objects.create(**validated_data)
        for data in pokemon_data:
            Pokemon.objects.create(team=team, **data)
        return team

    def update(self, instance, validated_data):
        pokemon_data = validated_data.pop('pokemon')

        # Update team fields
        instance.name = validated_data.get('name', instance.name)
        instance.generation = validated_data.get('generation', instance.generation)
        instance.description = validated_data.get('description', instance.description)
        instance.isFavorite = validated_data.get('isFavorite', instance.isFavorite)
        instance.save()

        # Clear existing Pokémon for this team
        instance.pokemon.all().delete()

        # Recreate Pokémon list
        for data in pokemon_data:
            Pokemon.objects.create(team=instance, **data)

        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserProfileSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'friends']

    def get_friends(self, obj):
        friends_users = [friend.user for friend in obj.friends.all()]
        return UserSerializer(friends_users, many=True).data

class FriendWithTeamsSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id")
    username = serializers.CharField(source="user.username")
    teams = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ["user_id", "username", "teams"]

    def get_teams(self, obj):
        teams = Team.objects.filter(user=obj.user).prefetch_related("pokemon")
        return TeamSerializer(teams, many=True).data