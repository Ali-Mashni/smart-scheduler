// client/src/pages/CustomerServicePage.js

import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TextInput from '../components/TextInput';
import PrimaryButton from '../components/PrimaryButton';
import MessageTextarea from '../components/MessageTextarea';
import FormCard from '../components/FormCard';
import Toast from '../components/Toast';
import api from '../api';

export default function CustomerServicePage() {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    const { subject, message } = form;
    if (!subject || !message) {
      setError('Please fill in both subject and message.');
      return;
    }
    try {
      await api.post('/api/support/requests', {
        title: subject,
        description: message,
      });
      setForm({ subject: '', message: '' });
      setError('');
      setToast({ message: 'Your request has been submitted.', type: 'success' });
    } catch (err) {
      console.error('Submit failed:', err);
      setToast({ message: 'Failed to submit request.', type: 'error' });
    }
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/activityManagement">Activity Management</TopBarButton>
        <TopBarButton to="/schedule">Schedule</TopBarButton>
        <TopBarButton to="/performance">Performance</TopBarButton>
        <TopBarButton to="/support">Your Requests</TopBarButton>
        <TopBarButton to="/customer-service" active>Contact Us</TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
      </TopBar>

      <div className="flex justify-center py-10">
        <FormCard title="Contact Customer Service" error={error}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
            />
            <MessageTextarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
            />
            <PrimaryButton type="submit">Send Message</PrimaryButton>
          </form>
        </FormCard>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
