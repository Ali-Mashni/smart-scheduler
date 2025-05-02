// client/src/components/ConversationMessages.js

import React from 'react';

export default function ConversationMessages({ messages, currentUser }) {
  return (
    <div className="space-y-4 overflow-auto max-h-[60vh]">
      {messages.map((msg, idx) => {
        // msg.sender is "Student" or "Agent"
        const isSent = msg.sender === currentUser;
        return (
          <div
            key={idx}
            // local (sent) messages on the right, remote on the left
            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[70%]
                break-words
                p-3
                rounded-lg
                ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}
              `}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );
}
