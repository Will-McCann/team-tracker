import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CreateTeamPage from './pages/CreateTeamPage';
import FriendsPage from './pages/FriendsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/create" element={<CreateTeamPage />} />
      <Route path="/edit/:teamId" element={<CreateTeamPage />} />
      <Route path="/friends" element={<FriendsPage />} />
    </Routes>
  );
}

export default App;
