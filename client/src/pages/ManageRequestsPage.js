// src/pages/ManageRequestsPage.js
import React, { useContext, useState, useMemo } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import { TicketContext } from '../context/TicketContext';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';

export default function ManageRequestsPage() {
  const { tickets, updateTicketStatus } = useContext(TicketContext);

  // Display all tickets except those escalated or dismissed.
  const availableTickets = useMemo(
    () => tickets.filter(ticket => ticket.status !== 'Escalated' && ticket.status !== 'Dismissed'),
    [tickets]
  );

  const [selectedTicketId, setSelectedTicketId] = useState(availableTickets[0]?.id || null);
  const selectedTicket = availableTickets.find(ticket => ticket.id === selectedTicketId);

  const isTicketMissingInfo = (ticket) =>
    !ticket.subject?.trim() || !ticket.message?.trim();

  const handleTicketAction = (ticketId, action) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    if (action !== 'Dismissed' && isTicketMissingInfo(ticket)) {
      alert('This request is missing crucial information. You can dismiss it if no further action is required.');
      return;
    }
    updateTicketStatus(ticketId, action);
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests" active>
          Manage Requests
        </TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/customer-service">NewTicket</TopBarButton>
      </TopBar>
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Manage User Requests</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 bg-bgCard p-4 rounded">
            {availableTickets.length === 0 ? (
              <p className="text-gray-400">No requests available.</p>
            ) : (
              <TicketList
                tickets={availableTickets}
                selectedId={selectedTicketId}
                onSelect={setSelectedTicketId}
              />
            )}
          </div>
          <div className="w-full md:w-2/3 bg-bgCard p-6 rounded">
            {selectedTicket ? (
              <TicketDetail
                ticket={selectedTicket}
                isMissingInfo={isTicketMissingInfo(selectedTicket)}
                onAction={handleTicketAction}
              />
            ) : (
              <p className="text-gray-400">Select a request to view details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
