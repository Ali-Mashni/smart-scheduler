// src/pages/CustomerServicePage.js
import React, { useContext, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TextInput from '../components/TextInput';
import PrimaryButton from '../components/PrimaryButton';
import { TicketContext } from '../context/TicketContext';

export default function CustomerServicePage() {
  const { addTicket } = useContext(TicketContext);
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please fill in all fields.');
      return;
    }

    // Create a new ticket object with the initial student message already in the messages array.
    const newTicket = {
      ...form,
      id: Date.now(),
      status: 'Pending',
      messages: [{ sender: 'Student', text: form.message }],
    };

    // Add the new ticket to the shared context.
    addTicket(newTicket);
    setForm({ name: '', email: '', subject: '', message: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
          <TopBar>
            <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
            <TopBarButton to="/faq-management">FAQ Management</TopBarButton>
            <TopBarButton to="/request-progress" >Request Progress</TopBarButton>
            <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
              <TopBarButton to="/customer-service" active>NewTicket</TopBarButton>
            </TopBar>
      <div className="flex flex-col md:flex-row justify-around items-start py-10 space-y-6 md:space-y-0">
        <div className="bg-bgCard p-8 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Contact Customer Service</h2>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              placeholder="Your Name"
              name="name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <TextInput
              placeholder="Your Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <TextInput
              placeholder="Subject"
              name="subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
            />
            <textarea
              placeholder="Message"
              name="message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md bg-inputBg border border-inputBorder text-white focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
            ></textarea>
            <PrimaryButton type="submit">Send Message</PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
