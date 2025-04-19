import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded text-white shadow-lg ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`}>
      {message}
    </div>
  );
}