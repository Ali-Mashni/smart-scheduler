import React, { useEffect, useState } from 'react';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/message')
      .then((res) => res.json())
      .then((data) => setMsg(data.message))
      .catch((err) => console.error('Error fetching message:', err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Smart Scheduler Test</h1>
      <p>Message from backend:</p>
      <pre style={{ backgroundColor: '#f4f4f4', padding: '1rem' }}>{msg}</pre>
    </div>
  );
}

export default App;
