import type { Team } from '../types/team';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteTeam } from '../services/api';

interface TeamListProps {
  teams: Team[];
  onTeamDeleted?: () => void;
}

function TeamList({ teams, onTeamDeleted }: TeamListProps) {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (teamId: string) => {
    const confirm = window.confirm('Are you sure you want to delete this team?');
    if (!confirm) return;

    try {
      setDeletingId(teamId);
      await deleteTeam(teamId);
      alert('Team deleted successfully.');
      onTeamDeleted?.();
    } catch (err) {
      alert('Failed to delete the team.');
    } finally {
      setDeletingId(null);
    }
  };

  if (teams.length === 0) {
    return <p className="text-center text-gray-500">No teams created yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams.map((team, index) => (
        <div key={index} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{team.name}</h2>
          <p className="text-sm text-gray-500 mb-2">{team.generation}</p>
          {team.description && (
            <p className="mb-2 text-sm text-gray-700">{team.description}</p>
          )}
          <ul className="list-disc list-inside">
            {team.pokemon.map((pokemon, idx) => (
              <li key={idx}>
                {pokemon.name
                  ? `${pokemon.name} (${pokemon.species}) - Lv. ${pokemon.level}`
                  : `${pokemon.species} - Lv. ${pokemon.level}`}
              </li>
            ))}
          </ul>
          <button
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
            onClick={() => navigate(`/edit/${team.id}`)}
          >
            Edit Team
          </button>
          <button
            onClick={() => handleDelete(team.id!.toString())}
            disabled={deletingId === team.id?.toString()}
            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            <Trash2 size={16} />
            {deletingId === team.id?.toString() ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      ))}
    </div>
  );
}
  
export default TeamList;