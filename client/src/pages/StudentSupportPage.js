// src/pages/StudentSupportPage.js
import React, { useContext, useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import { TicketContext } from '../context/TicketContext';
import ConversationMessages from '../components/ConversationMessages';
import MessageTextarea from '../components/MessageTextarea';
import PrimaryButton from '../components/PrimaryButton';
import Toast from '../components/Toast';

export default function StudentSupportPage() {
  const { tickets, addMessageToTicket } = useContext(TicketContext);

  const inProgressTickets = tickets.filter((t) => t.status === 'In Progress');
  const [selectedId, setSelectedId] = useState(inProgressTickets[0]?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const [toast, setToast] = useState(null);

  const selectedTicket = inProgressTickets.find(ticket => ticket.id === selectedId);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedTicket) return;
    addMessageToTicket(selectedTicket.id, newMessage.trim(), 'Student');
    setNewMessage('');
    setToast({ message: 'Message sent!', type: 'success' });
  };

  const fullConversation = (() => {
    if (!selectedTicket) return [];
    const baseMessage = selectedTicket.message;
    const messages = selectedTicket.messages || [];

    const messageAlreadyIncluded = messages.some(
      (msg) => msg.sender === 'Student' && msg.text === baseMessage
    );

    return messageAlreadyIncluded
      ? messages
      : [{ sender: 'Student', text: baseMessage }, ...messages];
  })();

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
              <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
                <TopBarButton to="/schedule" >Schedule</TopBarButton>
                <TopBarButton to="/performance">Performance</TopBarButton>
                <TopBarButton to ="/support" active>Your Requests</TopBarButton>
                <TopBarButton to ="/customer-service" >Contact Us</TopBarButton>
                <TopBarButton to="/login"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>
      </TopBar>

      <div className="p-8 flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-bgCard p-4 rounded">
          <h3 className="text-xl font-semibold mb-4">Your Requests</h3>
          {inProgressTickets.length === 0 ? (
            <p className="text-gray-400">No active conversations. Your requests must be marked "In Progress" to chat.</p>
          ) : (
            <ul className="space-y-3">
              {inProgressTickets.map((ticket) => (
                <li
                  key={ticket.id}
                  onClick={() => setSelectedId(ticket.id)}
                  className={`cursor-pointer p-3 rounded border ${
                    selectedId === ticket.id ? 'bg-primary text-white' : 'hover:bg-gray-800'
                  }`}
                >
                  <p className="font-bold">{ticket.subject}</p>
                  <p className="text-sm text-gray-400">{ticket.status}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-full md:w-2/3 bg-bgCard p-6 rounded">
          {selectedTicket ? (
            <>
              <h3 className="text-xl font-bold mb-2">
                {selectedTicket.subject}
              </h3>
              <ConversationMessages messages={fullConversation} />
              <MessageTextarea
                name="message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
              />
              <div className="flex justify-end mt-2">
                <PrimaryButton onClick={handleSend}>Send</PrimaryButton>
              </div>
            </>
          ) : (
            <p className="text-gray-400">Select an active ticket to continue chatting.</p>
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
