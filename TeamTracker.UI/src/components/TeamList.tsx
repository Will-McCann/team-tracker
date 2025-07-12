import type { Team } from '../types/team';

interface TeamListProps {
  teams: Team[];
}

function TeamList({ teams }: TeamListProps) {
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
        </div>
      ))}
    </div>
  );
}
  
export default TeamList;