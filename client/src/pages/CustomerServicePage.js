// Purpose: Public form for submitting new tickets
import React, { useContext, useState } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TextInput from '../components/TextInput';
import PrimaryButton from '../components/PrimaryButton';
import MessageTextarea from '../components/MessageTextarea';
import FormCard from '../components/FormCard';
import { TicketContext } from '../context/TicketContext';

export default function CustomerServicePage() {
  const { addTicket } = useContext(TicketContext);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;
    if (!name || !email || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }
    const newTicket = {
      id: Date.now(),
      ...form,
      status: 'Pending',
      messages: [{ sender: 'Student', text: message }],
    };
    addTicket(newTicket);
    setForm({ name: '', email: '', subject: '', message: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule" >Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
        <TopBarButton to="/support" >Your Requests</TopBarButton>
        <TopBarButton to="/customer-service" active>Contact Us</TopBarButton>
        <TopBarButton to="/login"><p className="text-red-500 hover:text-red-600">Logout</p></TopBarButton>
      </TopBar>

      <div className="flex justify-center py-10">
        <FormCard title="Contact Customer Service" error={error}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
            <TextInput name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} />
            <TextInput name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
            <MessageTextarea name="message" placeholder="Message" value={form.message} onChange={handleChange} />
            <PrimaryButton type="submit">Send Message</PrimaryButton>
          </form>
        </FormCard>
      </div>
    </div>
  );
}