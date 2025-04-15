import React, { useContext, useState, useMemo, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TicketList from '../components/TicketList';
import TicketDetail from '../components/TicketDetail';
import Toast from '../components/Toast';
import { TicketContext } from '../context/TicketContext';

export default function EscalatedTicketsPage() {
    const { tickets, updateTicketStatus, addAdminNoteToTicket } = useContext(TicketContext);
  const escalatedTickets = useMemo(
    () => tickets.filter(ticket => ticket.status === 'Escalated'),
    [tickets]
  );

  const [selectedId, setSelectedId] = useState(escalatedTickets[0]?.id || null);
  const [adminComment, setAdminComment] = useState('');
  const [toast, setToast] = useState(null);

  const selectedTicket = escalatedTickets.find(ticket => ticket.id === selectedId);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleResolve = () => {
    if (!adminComment.trim()) {
      setToast({ message: 'Please enter a comment before resolving.', type: 'error' });
      return;
    }

    // Extend ticket with adminNote (used in UI only)
    updateTicketStatus(selectedId, 'Resolved');
    addAdminNoteToTicket(selectedId, adminComment);
    setAdminComment('');
    setToast({ message: 'Ticket resolved successfully.', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/customer-service">NewTicket</TopBarButton>
        <TopBarButton to="/escalated-tickets" active>Escalated</TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Escalated Tickets</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 bg-bgCard p-4 rounded">
            {escalatedTickets.length === 0 ? (
              <p className="text-gray-400">No escalated tickets.</p>
            ) : (
              <TicketList
                tickets={escalatedTickets}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          {/* Main Panel */}
          <div className="w-full md:w-2/3 bg-bgCard p-6 rounded space-y-4">
            {selectedTicket ? (
              <>
                <TicketDetail
                  ticket={selectedTicket}
                  isMissingInfo={false}
                  onAction={() => {}}
                  hideActions={true} // <== disables default action buttons
                />

                {selectedTicket.adminNote && (
                  <div className="border p-4 bg-gray-800 rounded text-sm">
                    <p className="font-semibold mb-1">Admin Note:</p>
                    <p>{selectedTicket.adminNote}</p>
                  </div>
                )}

                <div>
                  <label className="block mb-2 font-semibold">Admin Resolution Note:</label>
                  <textarea
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
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
