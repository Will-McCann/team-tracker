import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../services/api';
import type { Team } from '../types/team';
import TeamList from '../components/TeamList';

function HomePage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [searchText, setSearchText] = useState('');

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

  const filteredTeams = teams
    .filter((t) => (filter === 'favorites' ? t.isFavorite : true))
    .filter((t) =>
      t.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Your Pokémon Teams
      </h2>

      {/* Create Team Button */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          className="bg-green-600 text-white text-lg px-6 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate('/create')}
        >
          Create New Team
        </button>
        <button
          className="bg-blue-600 text-white text-lg px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/friends')}
        >
          Friends
        </button>
      </div>

      {/* Filters + Search: flex row with minimal gap */}
      <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 mb-6">
        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilter('all')}
          >
            All Teams
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === 'favorites'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setFilter('favorites')}
          >
            Favorites
          </button>
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search teams..."
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-56"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Team List */}
      <TeamList teams={filteredTeams} refreshTeams={fetchTeams} />
    </div>
  );
}

export default HomePage;