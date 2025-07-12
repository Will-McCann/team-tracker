from rest_framework import serializers
from .models import Team, Pokemon

class PokemonSerializer(serializers.ModelSerializer):
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
