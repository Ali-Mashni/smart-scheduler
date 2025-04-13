// src/components/ConversationMessages.js
import React from 'react';

export default function ConversationMessages({ messages }) {
  return (
    <div className="mb-4 border p-4 rounded max-h-60 overflow-y-auto">
      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'Agent' ? 'text-right' : 'text-left'}>
            <p className="inline-block p-2 bg-gray-800 rounded mb-1">{msg.text}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No messages yet.</p>
      )}
    </div>
  );
}
