import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import ConversationMessages from '../components/ConversationMessages';
import MessageTextarea from '../components/MessageTextarea';
import PrimaryButton from '../components/PrimaryButton';
import Toast from '../components/Toast';
import api from '../api';

export default function StudentSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/support/requests');
        const all = res.data.data.map(t => ({
          ...t,
          id: t._id,
          subject: t.title,
          message: t.description,
        }));
        const relevant = all.filter(t => t.status === 'In Progress' || t.status === 'Pending');
        setTickets(relevant);
        if (relevant.length) setSelectedId(relevant[0].id);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const ticket = tickets.find(t => t.id === selectedId);
    if (!ticket) return;

    (async () => {
      try {
        const res = await api.get(`/api/support/messages/${selectedId}`);
        const msgs = res.data.data.map(m => ({
          sender: m.sender.role === 'support' ? 'Agent' : 'Student',
          text: m.message,
        }));
        setConversation(msgs);
      } catch (err) {
        console.error('Failed to load conversation:', err);
      }
    })();
  }, [selectedId]);

  useEffect(() => {
    if (!toast) return;
    const tm = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(tm);
  }, [toast]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post('/api/support/messages', {
        requestId: selectedId,
        message: newMessage.trim(),
      });
      setConversation(c => [
        ...c,
        { sender: 'Student', text: newMessage.trim() },
      ]);
      setNewMessage('');
      setToast({ message: 'Message sent!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to send.', type: 'error' });
    }
  };

  const selectedTicket = tickets.find(t => t.id === selectedId);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule">Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
        <TopBarButton to="/support" active>Your Requests</TopBarButton>
        <TopBarButton to="/customer-service">Contact Us</TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
      </TopBar>

      <div className="p-8 flex flex-col md:flex-row gap-6">
        {/* Ticket list */}
        <div className="w-full md:w-1/3 bg-bgCard p-4 rounded">
          <h3 className="text-xl font-semibold mb-4">Your Requests</h3>
          {!tickets.length ? (
            <p className="text-gray-400">You don't have any support requests yet.</p>
          ) : (
            <ul className="space-y-3">
              {tickets.map(t => (
                <li
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`cursor-pointer p-3 rounded border ${
                    selectedId === t.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <p className="font-bold">{t.subject}</p>
                  <p className="text-sm text-gray-400">{t.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat pane */}
        <div className="w-full md:w-2/3 bg-bgCard p-6 rounded">
          {selectedTicket ? (
            <>
              <h3 className="text-xl font-bold mb-2">
                {selectedTicket.subject}
              </h3>

              {conversation.length === 0 ? (
                <p className="text-gray-400 mb-4">
                  No replies yet. Please wait for our support team to respond.
                </p>
              ) : (
                <>
                  <ConversationMessages
                    messages={conversation}
                    currentUser="Student"
                  />
                  {selectedTicket.status === 'Pending' && (
                    <p className="text-yellow-400 mt-4 text-sm">
                      Your request is still pending. An agent will respond soon.
                    </p>
                  )}
                </>
              )}

              <MessageTextarea
                name="message"
                placeholder="Type your reply..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <PrimaryButton onClick={handleSend}>Send</PrimaryButton>
              </div>
            </>
          ) : (
            <p className="text-gray-400">
              Select a request to start chatting.
            </p>
          )}
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
