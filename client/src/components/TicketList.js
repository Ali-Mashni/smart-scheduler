// src/components/TicketList.js
import React from 'react';

export default function TicketList({ tickets, selectedId, onSelect, renderItem }) {
  return (
    <ul className="space-y-4">
      {tickets.map((ticket) => (
        <li
          key={ticket.id}
          onClick={() => onSelect(ticket.id)}
          className={`cursor-pointer border p-3 rounded ${
            selectedId === ticket.id ? 'border-primary' : 'border-gray-600 hover:border-primary'
          }`}
        >
          {renderItem ? (
            renderItem(ticket)
          ) : (
            <>
              <p className="font-semibold">{ticket.subject || 'Missing Subject'}</p>
              <p className="text-sm text-gray-400">{ticket.status}</p>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
