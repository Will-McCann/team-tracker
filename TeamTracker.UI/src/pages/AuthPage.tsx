import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../services/api';

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMode = location.state?.mode || 'login';
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await loginUser(username, password);
      } else {
        await signupUser(username, password);
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">
        {mode === 'login' ? 'Log In' : 'Create Account'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <input
          className="border px-2 py-1 rounded"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="border px-2 py-1 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mode === 'login' ? 'Log In' : 'Sign Up'}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
      <button
        className="text-sm text-blue-500 hover:underline mt-2"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login'
          ? "Don't have an account? Create one"
          : 'Already have an account? Log in'}
      </button>
    </div>
  );
}

export default AuthPage;
