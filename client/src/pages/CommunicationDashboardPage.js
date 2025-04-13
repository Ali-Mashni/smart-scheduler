// src/pages/CommunicationDashboardPage.js
import React, { useContext, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import PrimaryButton from '../components/PrimaryButton';
import { TicketContext } from '../context/TicketContext';
import TicketList from '../components/TicketList';
import ConversationMessages from '../components/ConversationMessages';

export default function CommunicationDashboardPage() {
  const { tickets, addMessageToTicket, updateTicketStatus } = useContext(TicketContext);
  
  // Active conversations: tickets with status "In Progress"
  const activeConversations = tickets.filter(ticket => ticket.status === 'In Progress');

  const [selectedConvId, setSelectedConvId] = useState(activeConversations[0]?.id);
  const [newMessage, setNewMessage] = useState('');

  const selectedConversation = activeConversations.find(ticket => ticket.id === selectedConvId);

  // Compute conversationMessages: if the ticket has messages, check if the first message
  // is the initial student message. If not, prepend it. Otherwise, just use the messages.
  let conversationMessages = [];
  if (selectedConversation) {
    if (selectedConversation.messages && selectedConversation.messages.length > 0) {
      if (
        selectedConversation.messages[0].sender !== 'Student' ||
        selectedConversation.messages[0].text !== selectedConversation.message
      ) {
        conversationMessages = [
          { sender: 'Student', text: selectedConversation.message },
          ...selectedConversation.messages,
        ];
      } else {
        conversationMessages = selectedConversation.messages;
      }
    } else {
      conversationMessages = [{ sender: 'Student', text: selectedConversation.message }];
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    addMessageToTicket(selectedConvId, newMessage);
    setNewMessage('');
  };

  // Close the conversation by marking it as "Resolved"
  const handleCloseConversation = () => {
    updateTicketStatus(selectedConvId, 'Resolved');
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard" active>Communication</TopBarButton>
        <TopBarButton to="/customer-service">NewTicket</TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Communication Dashboard</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar: List of active conversations */}
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
          {/* Main Panel: Conversation Details and Reply Area */}
          <div className="w-full md:w-2/3">
            {selectedConversation ? (
              <div>
                <h3 className="text-xl mb-2">
                  Conversation with {selectedConversation.name}
                </h3>
                <ConversationMessages messages={conversationMessages} />
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
              </div>
            ) : (
              <>No conversation selected.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
