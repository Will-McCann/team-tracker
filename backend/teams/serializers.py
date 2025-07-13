from rest_framework import serializers
from .models import Team, Pokemon

class PokemonSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = Pokemon
        fields = ['name', 'species', 'level']

class TeamSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer(many=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'generation', 'description', 'pokemon']

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
        instance.save()

        # Clear existing Pokémon for this team
        instance.pokemon.all().delete()

        # Recreate Pokémon list
        for data in pokemon_data:
            Pokemon.objects.create(team=instance, **data)

        return instance
