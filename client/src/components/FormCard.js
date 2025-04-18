import React from 'react';

export default function FormCard({ title, children, error }) {
  return (
    <div className="bg-bgCard p-8 rounded-xl shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {children}
    </div>
  );
}