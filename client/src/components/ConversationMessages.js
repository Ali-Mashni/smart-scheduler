import React from 'react';

export default function ConversationMessages({ messages }) {
  return (
    <div className="mb-4 space-y-2 max-h-80 overflow-y-auto border rounded p-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.sender === 'Agent' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div className={`text-sm max-w-xs px-3 py-2 rounded shadow ${
            msg.sender === 'Agent'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-white'
          }`}>
            <p className="text-xs text-gray-300 mb-1">{msg.sender}</p>
            <p>{msg.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
