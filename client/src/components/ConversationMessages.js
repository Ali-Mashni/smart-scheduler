import React from 'react';

export default function ConversationMessages({ messages }) {
  return (
    <div className="mb-4 border p-4 rounded max-h-60 overflow-y-auto space-y-2">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'Agent' ? 'justify-end' : 'justify-start'}`}
          >
            <p className="inline-block px-3 py-2 bg-gray-800 rounded text-sm">
              {msg.text}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">No messages yet.</p>
      )}
    </div>
  );
}