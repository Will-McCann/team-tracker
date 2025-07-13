import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../services/api';
import type { Team } from '../types/team';
import TeamList from '../components/TeamList';

function HomePage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Failed to fetch teams', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Pokémon Teams</h2>
      <button
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        onClick={() => navigate('/create')}
      >
        Create New Team
      </button>
      <TeamList teams={teams} onTeamDeleted={fetchTeams} />
    </div>
  );
}

export default HomePage;