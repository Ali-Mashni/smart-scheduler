import React, { createContext, useState } from 'react';

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  const addTicket = (ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const updateTicketStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

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

  // ✅ NEW: Add admin note field to ticket
  const addAdminNoteToTicket = (id, note) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, adminNote: note } : ticket
      )
    );
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicketStatus,
        addMessageToTicket,
        addAdminNoteToTicket, // ✅ Exported
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};
