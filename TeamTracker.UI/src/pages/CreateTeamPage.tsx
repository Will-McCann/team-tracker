import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { getTeamById, createTeam, editTeam } from '../services/api';
import type { Team } from '../types/team';
import type { Pokemon } from '../types/pokemon';

const generations = [
  'Gen I', 'Gen II', 'Gen III', 'Gen IV', 'Gen V',
  'Gen VI', 'Gen VII', 'Gen VIII', 'Gen IX',
];

type PokemonResult = {
  name: string;
  url: string;
};

type PokemonOption = {
  value: string;
  label: string;
  id: number;
};

export default function CreateTeamPage() {
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [generation, setGeneration] = useState('');
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon[]>(
    Array.from({ length: 6 }, () => ({ name: '', species: '', level: undefined, apiId: undefined }))
  );
  const [pokemonList, setPokemonList] = useState<PokemonOption[]>([]);

  const { teamId } = useParams();
  const isEditMode = !!teamId;

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=2000")
      .then((res) => res.json())
      .then((data: { results: PokemonResult[] }) => {
        const options: PokemonOption[] = data.results.map((p: PokemonResult) => {
          // Extract numeric ID from URL (e.g. "https://pokeapi.co/api/v2/pokemon/25/")
          const match = p.url.match(/\/pokemon\/(\d+)\//);
          const id = match ? parseInt(match[1], 10) : 0;
  
          return {
            value: p.name.toLowerCase(),
            label: p.name.charAt(0).toUpperCase() + p.name.slice(1),
            id
          };
        });
  
        setPokemonList(options);
      })
      .catch((err) => console.error("Error fetching Pokémon:", err));
  }, []);

  useEffect(() => {
    if (isEditMode) {
      (async () => {
        try {
          const team = await getTeamById(teamId!);
          setTeamName(team.name);
          setGeneration(team.generation);
          setDescription(team.description!);
          setIsFavorite(team.isFavorite);

          const padded = [
          ...team.pokemon,
          ...Array.from({ length: 6 - team.pokemon.length }, () => ({
            name: '',
            species: '',
            level: undefined,
            apiId: undefined,
          })),
        ];

        setPokemon(padded);
        } catch (error) {
          alert('Failed to load team data.');
        }
      })();
    }
  }, [teamId]);

  const handlePokemonChange = (index: number, field: keyof Pokemon, value: string | number | undefined) => {
    const updated = [...pokemon];
    updated[index] = { ...updated[index], [field]: value };
    setPokemon(updated);
  };

  const handleSave = async () => {
    const missingFields: string[] = [];

    if (!teamName.trim()) {
      missingFields.push('Team Name');
    }

    if (!generation) {
      missingFields.push('Generation');
    }

    const validPokemon = pokemon.filter(p => p && p.species);
    if (validPokemon.length === 0) {
      missingFields.push('At least one Pokémon');
    }

    if (missingFields.length > 0) {
      alert(`Please fill out the following before saving:\n- ${missingFields.join('\n- ')}`);
      return;
    }

    const teamData: Team = {
      name: teamName,
      generation,
      description,
      isFavorite,
      pokemon: pokemon
      .filter(p => p && p.species)
      .map(p => ({
        name: p.name || '',
        species: p.species,
        level: p.level ? Number(p.level) : 1,
        apiId: p.apiId,
      }))
    };

    try {
      if (isEditMode) {
        await editTeam(teamId!, teamData);
      } else {
        await createTeam(teamData);
      }
      alert('Team Successfully Saved');
      navigate('/home');
    } catch (error) {
      alert('Failed to save team. Please try again.');
    }
  };

  const pokemonOptions = pokemonList.map((p) => ({
    value: p.value,
    label: p.label,
    id: p.id
  }));
  
  // Custom Option component with sprite from GitHub
  const Option = (props: any) => {
    const { data, innerRef, innerProps } = props;
    const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
  
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
      >
        <img src={imgUrl} alt={data.label} className="w-12 h-12 mr-2" />
        <span>{data.label}</span>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        {isEditMode ? 'Edit Pokémon Team' : 'Create a New Pokémon Team'}
      </h1>

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
              <Select
                options={pokemonOptions}
                value={
                  pokemon.species
                    ? pokemonOptions.find(
                        (opt) => opt.label === pokemon.species
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setPokemon(prev => {
                      const updated = [...prev];
                      updated[index] = {
                        ...updated[index],
                        species: selectedOption.label,
                        apiId: selectedOption.id,
                      };
                      return updated;
                    });
                  } else {
                    setPokemon(prev => {
                      const updated = [...prev];
                      updated[index] = {
                        ...updated[index],
                        species: "",
                        apiId: undefined,
                      };
                      return updated;
                    });
                  }
                }}                
                placeholder="Select Pokémon"
                className="w-full"
                classNamePrefix="react-select"
                filterOption={(candidate, input) =>
                  candidate.label.toLowerCase().includes(input.toLowerCase())
                }
                noOptionsMessage={() => "No Pokémon found"}
                components={{ Option }}
              />

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
                value={pokemon.level === undefined ? '' : pokemon.level}
                min={1}
                max={100}
                onChange={e => {
                  const val = e.target.value;

                  if (val === '') {
                    handlePokemonChange(index, 'level', '');
                    return;
                  }

                  const num = Number(val);
                  if (!isNaN(num)) {
                    if (num > 100) {
                      handlePokemonChange(index, 'level', '100');
                    } else if (num < 1) {
                      handlePokemonChange(index, 'level', '1');
                    } else {
                      handlePokemonChange(index, 'level', val);
                    }
                  } else {
                    handlePokemonChange(index, 'level', val);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="favorite"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="favorite" className="text-sm font-medium">
          Favorite
        </label>
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
          onClick={handleSave}
        >
          {isEditMode ? 'Update Team' : 'Save Team'}
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