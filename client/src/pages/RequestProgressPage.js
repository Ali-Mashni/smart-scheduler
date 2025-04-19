// src/pages/RequestProgressPage.js
import React, { useContext, useMemo, useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import { TicketContext } from '../context/TicketContext';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';

const getProgressPercentage = (status) => {
  switch (status) {
    case 'Pending':
      return 0;
    case 'In Progress':
      return 50;
    case 'Resolved':
      return 100;
    default:
      return 0;
  }
};

export default function RequestProgressPage() {
  const { tickets } = useContext(TicketContext);
  const relevantTickets = useMemo(
    () => tickets.filter(ticket => ticket.status !== 'Escalated' && ticket.status !== 'Dismissed'),
    [tickets]
  );

  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress" active>Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton> 
        <TopBarButton to="/login"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Request Progress Tracking</h2>
        {relevantTickets.length === 0 ? (
          <p className="text-gray-400">No active requests.</p>
        ) : (
          <ul className="space-y-4">
            {relevantTickets.map(ticket => {
              const progress = getProgressPercentage(ticket.status);
              return (
                <li key={ticket.id} className="border p-4 rounded bg-bgCard">
                  <p className="font-semibold">{ticket.subject || 'Missing Subject'}</p>
                  <p>Status: {ticket.status} ({progress}%)</p>
                  <ProgressBar progress={progress} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Toast (reserved for future interaction) */}
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
