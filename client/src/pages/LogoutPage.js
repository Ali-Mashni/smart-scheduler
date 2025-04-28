// client/src/pages/LogoutPage.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutPage({ setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token and clear user in App state
    localStorage.removeItem('token');
    setUser(null);
    // Redirect to login
    navigate('/login', { replace: true });
  }, [navigate, setUser]);

  return null; // nothing to render
}
