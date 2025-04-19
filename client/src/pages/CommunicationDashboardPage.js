// src/pages/CommunicationDashboardPage.js
import React, { useContext, useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import PrimaryButton from '../components/PrimaryButton';
import Toast from '../components/Toast';
import { TicketContext } from '../context/TicketContext';
import TicketList from '../components/TicketList';
import ConversationMessages from '../components/ConversationMessages';

export default function CommunicationDashboardPage() {
  const { tickets, addMessageToTicket, updateTicketStatus } = useContext(TicketContext);

  const activeConversations = tickets.filter(ticket => ticket.status === 'In Progress');
  const [selectedConvId, setSelectedConvId] = useState(activeConversations[0]?.id);
  const [newMessage, setNewMessage] = useState('');
  const [toast, setToast] = useState(null);

  const selectedConversation = activeConversations.find(ticket => ticket.id === selectedConvId);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    addMessageToTicket(selectedConvId, newMessage.trim());
    setNewMessage('');
    setToast({ message: 'Message sent!', type: 'success' });
  };

  const handleCloseConversation = () => {
    updateTicketStatus(selectedConvId, 'Resolved');
    setToast({ message: 'Conversation marked as resolved.', type: 'success' });
  };

  const buildConversation = () => {
    if (!selectedConversation) return [];
    const { message, messages = [] } = selectedConversation;

    // Avoid duplication if the first message is already added in the thread
    const hasInitial =
      messages.length > 0 &&
      messages[0].text === message &&
      messages[0].sender === 'Student';

    return hasInitial
      ? messages
      : [{ sender: 'Student', text: message }, ...messages];
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard" active>Communication</TopBarButton> 
        <TopBarButton to="/login"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>   
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Communication Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <h3 className="text-xl mb-2">Conversations</h3>
            {activeConversations.length === 0 ? (
              <>
                No active conversations.
                <br />
                (Tickets must be marked "In Progress" in Manage Requests to appear here.)
              </>
            ) : (
              <TicketList
                tickets={activeConversations}
                selectedId={selectedConvId}
                onSelect={setSelectedConvId}
                renderItem={(ticket) => (
                  <>
                    <p className="font-semibold">{ticket.name} - {ticket.subject}</p>
                    <p className="text-sm text-gray-400">{ticket.status}</p>
                  </>
                )}
              />
            )}
          </div>

          {/* Main Panel */}
          <div className="w-full md:w-2/3">
            {selectedConversation ? (
              <>
                <h3 className="text-xl font-bold mb-2">
                  Conversation with {selectedConversation.name}
                </h3>
                <ConversationMessages messages={buildConversation()} />
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-2 rounded bg-inputBg border border-inputBorder"
                  rows="3"
                />
                <div className="flex gap-4 mt-2">
                  <PrimaryButton onClick={handleSendMessage}>
                    Send Message
                  </PrimaryButton>
                  <PrimaryButton onClick={handleCloseConversation}>
                    Close Conversation
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <p className="text-gray-400">No conversation selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
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
