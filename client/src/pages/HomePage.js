import React, { useEffect, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';

export default function HomePage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5050/api/message')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error('Error fetching message:', err);
        setMessage('Failed to connect to backend.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/" active>Home</TopBarButton>
        <TopBarButton to="/login">Login</TopBarButton>
        <TopBarButton to="/signup">Signup</TopBarButton>
      </TopBar>

      <div className="flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Smart Scheduler!</h1>
        <p className="text-lg text-gray-300">Backend says: <span className="text-accent">{message}</span></p>
      </div>
    </div>
  );
}
