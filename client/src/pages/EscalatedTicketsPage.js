// client/src/pages/EscalatedTicketsPage.js

import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import Toast from '../components/Toast';
import api from '../api';

export default function EscalatedTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [toast, setToast] = useState(null);

  // Load escalated tickets with proper field mapping
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/support/requests');
        const all = res.data.data.map(t => ({
          ...t,
          id: t._id,
          subject: t.title,
          message: t.description,
          name: `${t.user.firstName} ${t.user.lastName}`,
          email: t.user.email
        }));
        const escalated = all.filter(t => t.status === 'Escalated');
        setTickets(escalated);
        if (escalated.length && !selectedId) {
          setSelectedId(escalated[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch escalated tickets:', err);
      }
    };
    load();
  }, [selectedId]);

  // Auto‐dismiss toasts
  useEffect(() => {
    if (!toast) return;
    const tm = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(tm);
  }, [toast]);

  const selectedTicket = tickets.find(t => t.id === selectedId);

  const handleResolve = async () => {
    if (!adminComment.trim()) {
      setToast({ message: 'Please enter a comment before resolving.', type: 'error' });
      return;
    }
    try {
      await api.put(`/api/support/requests/${selectedId}/status`, { status: 'Resolved' });
      setTickets(prev => prev.filter(t => t.id !== selectedId));
      setSelectedId(null);
      setToast({ message: 'Ticket resolved successfully.', type: 'success' });
    } catch (err) {
      console.error('Resolve failed:', err);
      setToast({ message: 'Could not resolve ticket.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Escalated Tickets</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 bg-bgCard p-4 rounded">
            {tickets.length === 0 ? (
              <p className="text-gray-400">No escalated tickets.</p>
            ) : (
              <TicketList
                tickets={tickets}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
          <div className="w-full md:w-2/3 bg-bgCard p-6 rounded space-y-4">
            {selectedTicket ? (
              <>
                <TicketDetail
                  ticket={selectedTicket}
                  isMissingInfo={false}
                  onAction={() => {}}
                  hideActions
                />
                {selectedTicket.adminNote && (
                  <div className="border p-4 bg-gray-800 rounded text-sm">
                    <p className="font-semibold mb-1">Admin Note:</p>
                    <p>{selectedTicket.adminNote}</p>
                  </div>
                )}
                <div>
                  <label className="block mb-2 font-semibold">
                    Admin Resolution Note:
                  </label>
                  <textarea
                    value={adminComment}
                    onChange={e => setAdminComment(e.target.value)}
                    placeholder="Write your resolution comment here..."
                    className="w-full p-3 rounded bg-inputBg border border-inputBorder text-white"
                    rows="4"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleResolve}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Select a ticket to view details.</p>
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
