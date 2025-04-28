// client/src/pages/FAQManagementPage.js

import React, { useState, useEffect, useMemo } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import PrimaryButton from '../components/PrimaryButton';
import TextInput from '../components/TextInput';
import FAQItem from '../components/FAQItem';
import FAQForm from '../components/FAQForm';
import Toast from '../components/Toast';
import api from '../api';

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFAQId, setSelectedFAQId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewFAQ, setIsNewFAQ] = useState(false);
  const [faqEdit, setFaqEdit] = useState({ question: '', answer: '' });
  const [toast, setToast] = useState(null);

  // Load FAQs on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/support/faqs');
        const data = res.data.data.map(f => ({ ...f, id: f._id }));
        setFaqs(data);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setToast({ message: 'Could not load FAQs.', type: 'error' });
      }
    })();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredFAQs = useMemo(
    () => faqs.filter(f => f.question.toLowerCase().includes(search.toLowerCase())),
    [faqs, search]
  );

  const selectFAQ = faqId => {
    setSelectedFAQId(faqId);
    setIsEditing(false);
    setIsNewFAQ(false);
    const f = faqs.find(x => x.id === faqId);
    if (f) setFaqEdit({ question: f.question, answer: f.answer });
  };

  const handleAddNew = () => {
    setSelectedFAQId(null);
    setFaqEdit({ question: '', answer: '' });
    setIsEditing(true);
    setIsNewFAQ(true);
  };

  const handleSave = async () => {
    if (!faqEdit.question.trim() || !faqEdit.answer.trim()) {
      alert('Please fill in both the question and answer.');
      return;
    }
    try {
      if (isNewFAQ) {
        const res = await api.post('/api/support/faqs', faqEdit);
        const created = { ...res.data.data, id: res.data.data._id };
        setFaqs(prev => [...prev, created]);
        setSelectedFAQId(created.id);
      } else {
        await api.put(`/api/support/faqs/${selectedFAQId}`, faqEdit);
        setFaqs(prev =>
          prev.map(f => (f.id === selectedFAQId ? { ...f, ...faqEdit } : f))
        );
      }
      setIsEditing(false);
      setIsNewFAQ(false);
      setToast({ message: 'FAQ saved!', type: 'success' });
    } catch (err) {
      console.error('Save failed:', err);
      setToast({ message: 'Error saving FAQ.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/api/support/faqs/${selectedFAQId}`);
      setFaqs(prev => prev.filter(f => f.id !== selectedFAQId));
      setSelectedFAQId(null);
      setIsEditing(false);
      setFaqEdit({ question: '', answer: '' });
      setToast({ message: 'FAQ deleted.', type: 'success' });
    } catch (err) {
      console.error('Delete failed:', err);
      setToast({ message: 'Error deleting FAQ.', type: 'error' });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (isNewFAQ) {
      setSelectedFAQId(null);
      setFaqEdit({ question: '', answer: '' });
      setIsNewFAQ(false);
    }
  };

  const selectedFAQ = faqs.find(f => f.id === selectedFAQId);

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/manage-requests">Manage Requests</TopBarButton>
        <TopBarButton to="/faq-management" active>FAQ Management</TopBarButton>
        <TopBarButton to="/request-progress">Request Progress</TopBarButton>
        <TopBarButton to="/communication-dashboard">Communication</TopBarButton>
        <TopBarButton to="/logout">
          <p className="text-red-500 hover:text-red-600">Logout</p>
        </TopBarButton>
      </TopBar>

      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">FAQ Management</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 bg-bgCard p-6 rounded-lg shadow-lg">
            <TextInput
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="my-4">
              <PrimaryButton onClick={handleAddNew} className="w-full">
                Add New
              </PrimaryButton>
            </div>
            {filteredFAQs.length === 0 ? (
              <p className="text-gray-400">No FAQs found.</p>
            ) : (
              <ul className="space-y-4">
                {filteredFAQs.map(faq => (
                  <FAQItem
                    key={faq.id}
                    faq={faq}
                    isSelected={faq.id === selectedFAQId}
                    onSelect={selectFAQ}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="w-full md:w-2/3 bg-bgCard p-6 rounded-lg shadow-lg">
            {isEditing ? (
              <FAQForm
                faqEdit={faqEdit}
                onChange={e => setFaqEdit(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : selectedFAQ ? (
              <div>
                <h3 className="text-2xl font-bold mb-4">{selectedFAQ.question}</h3>
                <p className="text-lg mb-6">{selectedFAQ.answer}</p>
                <div className="flex gap-4">
                  <PrimaryButton onClick={() => setIsEditing(true)}>Edit</PrimaryButton>
                  <PrimaryButton onClick={handleDelete}>Delete</PrimaryButton>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">
                Select an FAQ to view or click "Add New" to create one.
              </p>
            )}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
