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
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4 ">Smart Scheduler Test</h1>
      <p className="text-lg">Message from backend:</p>
      <pre className="bg-gray-100 p-4 rounded mt-2 text-sm">{msg}</pre>
    </div>
  );
}

export default App;
