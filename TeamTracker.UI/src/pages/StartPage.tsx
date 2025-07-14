import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-3xl font-bold mb-6">Welcome to Pokémon Team Builder</h1>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-48"
        onClick={() => navigate('/auth', { state: { mode: 'login' } })}
      >
        Log In
      </button>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-48"
        onClick={() => navigate('/auth', { state: { mode: 'signup' } })}
      >
        Create Account
      </button>
    </div>
  );
}

export default StartPage;
