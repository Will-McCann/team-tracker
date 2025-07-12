import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../services/api';
import type { Team } from '../types/team';
import type { Pokemon } from '../types/pokemon';

const generations = [
  'Gen I', 'Gen II', 'Gen III', 'Gen IV', 'Gen V',
  'Gen VI', 'Gen VII', 'Gen VIII', 'Gen IX',
];

const pokemonList = [
  'Pikachu', 'Charizard', 'Bulbasaur', 'Squirtle', 'Gengar', 'Dragonite',
];

export default function CreateTeamPage() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [generation, setGeneration] = useState('');
  const [description, setDescription] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon[]>(
    Array(6).fill({ name: '', species: '', level: 1 })
  );

  const handlePokemonChange = (index: number, field: keyof Pokemon, value: string | number) => {
    const updated = [...pokemon];
    updated[index] = { ...updated[index], [field]: value };
    setPokemon(updated);
  };

  const handleSave = async () => {
    const teamData: Team = {
      name: teamName,
      generation,
      description,
      pokemon: pokemon.filter(p => p.species)
    };

    try {
      await createTeam(teamData);
      alert('Team Successfully Saved');
      navigate('/home');
    } catch (error) {
      alert('Failed to save team. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Create a New Pokémon Team</h1>

      {/* Team Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Team Name</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
        />
      </div>

      {/* Generation */}
      <div>
        <label className="block text-sm font-medium mb-1">Generation</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={generation}
          onChange={(e) => setGeneration(e.target.value)}
        >
          <option value="">Select generation</option>
          {generations.map((gen) => (
            <option key={gen} value={gen}>{gen}</option>
          ))}
        </select>
      </div>

      {/* Pokémon Grid */}
      <div>
        <label className="block text-sm font-medium mb-2">Team Pokémon</label>
        <div className="grid grid-cols-3 gap-4">
          {pokemon.map((pokemon, index) => (
            <div key={index} className="border rounded p-2 space-y-2">
              {/* Species Select */}
              <select
                className="w-full p-1 border rounded"
                value={pokemon.species}
                onChange={e => handlePokemonChange(index, 'species', e.target.value)}
              >
                <option value="">Select Pokémon</option>
                {pokemonList.map((species) => (
                  <option key={species} value={species}>{species}</option>
                ))}
              </select>

              {/* Nickname */}
              <input
                type="text"
                placeholder="Nickname (optional)"
                className="w-full p-1 border rounded"
                value={pokemon.name}
                onChange={e => handlePokemonChange(index, 'name', e.target.value)}
              />

              {/* Level */}
              <input
                type="number"
                placeholder="Level"
                className="w-full p-1 border rounded"
                min={1}
                max={100}
                onChange={e => handlePokemonChange(index, 'level', Number(e.target.value))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Team Notes (Optional)</label>
        <textarea
          rows={4}
          className="w-full border rounded px-3 py-2"
          placeholder="Write a short description or strategy for your team..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {/* Save Button */}
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => {
            handleSave();
          }}
        >
          Save Team
        </button>

        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
        >
          Back To Home
        </button>
      </div>
    </div>
  );
}