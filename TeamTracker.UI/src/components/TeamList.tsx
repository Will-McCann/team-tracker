import type { Team } from '../types/team';
import { useState } from 'react';
import TeamCard from './TeamCard';
import { deleteTeam } from '../services/api';

interface TeamListProps {
  teams: Team[];
  refreshTeams?: () => void;
  readOnly?: boolean;
}

function TeamList({ teams, refreshTeams, readOnly = false }: TeamListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (teamId: string) => {
    if (readOnly) return;
    const confirm = window.confirm('Are you sure you want to delete this team?');
    if (!confirm) return;

    try {
      setDeletingId(teamId);
      await deleteTeam(teamId);
      alert('Team deleted successfully.');
      refreshTeams?.();
    } catch (err) {
      alert('Failed to delete the team.');
    } finally {
      setDeletingId(null);
    }
  };

  if (teams.length === 0) {
    return <p className="text-center text-gray-500">No teams found.</p>;
  }

  return (
    <div className="h-[70vh] overflow-y-auto pr-2">
      <div className="max-w-4xl mx-auto space-y-4">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onDelete={handleDelete}
            deletingId={deletingId}
            refreshTeams={refreshTeams}
            readOnly={readOnly}
          />
        ))}
      </div>
    </div>
  );
}

export default TeamList;