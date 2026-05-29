import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Guides from './pages/Guides';
import FlashCards from './pages/FlashCards';
import Errors from './pages/Errors';

function RequireAuth({ children }) {
  const userId = localStorage.getItem('userId');
  return userId ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/practice" element={<RequireAuth><Practice /></RequireAuth>} />
        <Route path="/guides" element={<RequireAuth><Guides /></RequireAuth>} />
        <Route path="/flashcards" element={<RequireAuth><FlashCards /></RequireAuth>} />
        <Route path="/errors" element={<RequireAuth><Errors /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
