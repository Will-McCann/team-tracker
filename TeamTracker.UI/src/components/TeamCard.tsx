import type { Team } from '../types/team';
import { Trash2, Pencil, Star } from 'lucide-react';
import { editTeam } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface TeamCardProps {
  team: Team;
  onDelete: (teamId: string) => void;
  deletingId: string | null;
  refreshTeams?: () => void;
}

function TeamCard({ team, onDelete, deletingId, refreshTeams }: TeamCardProps) {
  const navigate = useNavigate();

  const handleToggleFavorite = async () => {
    try {
        const updatedTeam = {
          ...team,
          isFavorite: !team.isFavorite,
        };
    
        await editTeam(team.id!.toString(), updatedTeam);
        refreshTeams?.();
      } catch (err) {
        alert('Failed to update favorite status');
      }
  };

  return (
    <div className="border p-4 rounded shadow bg-white">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h2 className="text-xl font-semibold">{team.name}</h2>
          <p className="text-sm text-gray-500">{team.generation}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
        <Star
            className={`cursor-pointer ${team.isFavorite ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`}
            size={21}
            onClick={handleToggleFavorite}
        />

            <button
                className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                onClick={() => navigate(`/edit/${team.id}`)}
            >
                <Pencil size={14} />
                <span>Edit</span>
            </button>

            <button
                onClick={() => onDelete(team.id!.toString())}
                disabled={deletingId === team.id?.toString()}
                className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
            >
                <Trash2 size={16} />
                {deletingId === team.id?.toString() ? 'Deleting...' : 'Delete'}
            </button>
            </div>
      </div>
  
      {team.description && (
        <p className="mb-3 text-sm text-gray-700">{team.description}</p>
      )}
  
      <div className="grid grid-cols-3 gap-2 mb-4">
        {team.pokemon.slice(0, 6).map((pokemon, idx) => (
          <div
            key={idx}
            className="bg-gray-100 p-2 rounded text-xs text-center text-gray-800"
          >
            <div className="font-medium">
              {pokemon.name
                ? `${pokemon.name} (${pokemon.species})`
                : `${pokemon.species}`}
            </div>
            <div className="text-gray-500">Lv. {pokemon.level}</div>
          </div>
        ))}
      </div>
    </div>
  );  
}

export default TeamCard;