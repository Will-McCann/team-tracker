import { Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage';
import HomePage from './pages/HomePage';
import CreateTeamPage from './pages/CreateTeamPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/create" element={<CreateTeamPage />} />
      <Route path="/edit/:teamId" element={<CreateTeamPage />} />
    </Routes>
  );
}

export default App;
