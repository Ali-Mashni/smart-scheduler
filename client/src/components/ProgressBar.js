// src/components/ProgressBar.js
import React from 'react';

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-600 rounded h-2 mt-1">
      <div
        className="bg-green-600 h-2 rounded"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
