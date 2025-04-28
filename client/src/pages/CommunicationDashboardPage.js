// client/src/pages/CommunicationDashboardPage.js

import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import PrimaryButton from '../components/PrimaryButton';
import Toast from '../components/Toast';
import TicketList from '../components/TicketList';
import ConversationMessages from '../components/ConversationMessages';
import MessageTextarea from '../components/MessageTextarea';
import api from '../api';

export default function CommunicationDashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [toast, setToast] = useState(null);

  // Load tickets once on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/support/requests');
        const all = res.data.data.map(t => ({
          ...t,
          id: t._id,
          subject: t.title,
          message: t.description,
          name: `${t.user.firstName} ${t.user.lastName}`
        }));
        const active = all.filter(t => t.status === 'In Progress');
        setTickets(active);
        if (active.length) setSelectedId(active[0].id);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    })();
  }, []);

  // Fetch conversation once per ticket selection
  useEffect(() => {
    if (!selectedId) return;
    const ticket = tickets.find(t => t.id === selectedId);
    if (!ticket) return;

    (async () => {
      try {
      
        const res = await api.get(`/api/support/messages/${selectedId}`);
        const msgs = res.data.data.map(m => ({
          sender: m.sender.role === 'support' ? 'Agent' : 'Student',
          text: m.message
        }));
        setConversation(msgs);
      } catch (err) {
        console.error('Failed to load conversation:', err);
      }
    })();
  }, [selectedId]);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    const tm = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(tm);
  }, [toast]);

  // Send agent reply
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post('/api/support/messages', {
        requestId: selectedId,
        message: newMessage.trim()
      });
      setConversation(c => [
        ...c,
        { sender: 'Agent', text: newMessage.trim() }
      ]);
      setNewMessage('');
      setToast({ message: 'Sent!', type: 'success' });
    } catch (err) {
      console.error('Send failed:', err);
      setToast({ message: 'Failed to send.', type: 'error' });
    }
  };

  // Close conversation button
  const handleClose = async () => {
    try {
      await api.put(`/api/support/requests/${selectedId}/status`, { status: 'Resolved' });
      setTickets(prev => prev.filter(t => t.id !== selectedId));
      setSelectedId(null);
      setConversation([]);
      setToast({ message: 'Conversation closed!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to close.', type: 'error' });
    }
  };

  const selected = tickets.find(t => t.id === selectedId) || {};

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard" active>
          Communication
        </TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Communication Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Ticket list */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl mb-2">Conversations</h3>
            <TicketList
              tickets={tickets}
              selectedId={selectedId}
              onSelect={setSelectedId}
              renderItem={t => (
                <>
                  <p className="font-semibold">{t.name} - {t.subject}</p>
                  <p className="text-sm text-gray-400">{t.status}</p>
                </>
              )}
            />
          </div>

          {/* Chat pane */}
          <div className="w-full md:w-2/3 bg-bgCard p-6 rounded">
            {selectedId ? (
              <>
                <h3 className="text-xl font-bold mb-2">Chat with {selected.name}</h3>
                <ConversationMessages
                  messages={conversation}
                  currentUser="Agent"
                />
                <MessageTextarea
                  name="message"
                  placeholder="Type your reply…"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <div className="flex gap-4 mt-2">
                  <PrimaryButton onClick={handleSend}>Send Message</PrimaryButton>
                  <PrimaryButton
                    onClick={handleClose}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Close Conversation
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <p className="text-gray-400">Select a conversation.</p>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
