// client/src/pages/RequestProgressPage.js

import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import ProgressBar from '../components/ProgressBar';
import Toast from '../components/Toast';
import api from '../api';

const getProgress = status => {
  switch (status) {
    case 'Pending':     return 0;
    case 'In Progress': return 50;
    case 'Resolved':    return 100;
    default:            return 0;
  }
};

export default function RequestProgressPage() {
  const [tickets, setTickets] = useState([]);
  const [toast, setToast] = useState(null);

  // Load all non‐escalated tickets with proper mapping
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
        setTickets(all.filter(t => !['Escalated', 'Dismissed'].includes(t.status)));
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      }
    };
    load();
  }, []);

  // Auto-clear toasts
  useEffect(() => {
    if (!toast) return;
    const tm = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(tm);
  }, [toast]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress" active>Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Request Progress Tracking</h2>
        {!tickets.length ? (
          <p className="text-gray-400">No active requests.</p>
        ) : (
          <ul className="space-y-4">
            {tickets.map(t => {
              const pct = getProgress(t.status);
              return (
                <li key={t.id} className="border p-4 rounded bg-bgCard">
                  <p className="font-semibold">{t.subject || 'No Subject'}</p>
                  <p>Status: {t.status} ({pct}%)</p>
                  <ProgressBar progress={pct} />
                </li>
              );
            })}
          </ul>
        )}
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
