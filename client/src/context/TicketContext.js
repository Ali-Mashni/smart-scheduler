// src/context/TicketContext.js
import React, { createContext, useState } from 'react';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  // Start with an empty list of tickets.
  const [tickets, setTickets] = useState([]);

  // Add a new ticket to the context
  const addTicket = (ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  // Function to update ticket status
  const updateTicketStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  // Function to add an agent message to a ticket’s conversation
  const addMessageToTicket = (id, messageText) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === id) {
          const updatedMessages = ticket.messages ? [...ticket.messages] : [];
          updatedMessages.push({ sender: 'Agent', text: messageText });
          return { ...ticket, messages: updatedMessages };
        }
        return ticket;
      })
    );
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicketStatus, addMessageToTicket }}>
      {children}
    </TicketContext.Provider>
  );
};
