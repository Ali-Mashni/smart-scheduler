// client/src/pages/ManageRequestsPage.js

import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import Toast from '../components/Toast';
import api from '../api';

export default function ManageRequestsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [toast, setToast] = useState(null);

  const isTicketMissingInfo = ticket =>
    !ticket.subject?.trim() || !ticket.message?.trim();

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const res = await api.get('/api/support/requests');
        const data = res.data.data.map(t => ({
          ...t,
          id: t._id,
          subject: t.title,
          message: t.description,
          name: `${t.user.firstName} ${t.user.lastName}`,
          email: t.user.email,
        }));
        setTickets(data);
        if (data.length && !selectedTicketId) {
          setSelectedTicketId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    };
    loadTickets();
  }, [selectedTicketId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const availableTickets = tickets.filter(
    t => t.status !== 'Escalated' && t.status !== 'Dismissed'
  );

  const selectedTicket = availableTickets.find(t => t.id === selectedTicketId);

  const handleTicketAction = async (ticketId, action) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    if (action !== 'Dismissed' && isTicketMissingInfo(ticket)) {
      alert(
        'This request is missing crucial information. You can dismiss it if no further action is required.'
      );
      return;
    }
    try {
      await api.put(`/api/support/requests/${ticketId}/status`, { status: action });
      setTickets(prev =>
        prev.map(t => (t.id === ticketId ? { ...t, status: action } : t))
      );
      setToast({ message: `Ticket marked as "${action}".`, type: 'success' });
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setToast({ message: 'Error updating ticket status.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests" active>Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
