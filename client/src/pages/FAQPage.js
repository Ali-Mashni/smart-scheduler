// client/src/pages/FAQPage.js

import React, { useState, useEffect, useMemo } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TextInput from '../components/TextInput';
import { AiOutlineDown } from 'react-icons/ai';
import Toast from '../components/Toast';
import api from '../api';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/support/faqs');
        const data = res.data.data.map(f => ({ ...f, id: f._id }));
        setFaqs(data);
      } catch (err) {
        console.error('Failed to fetch FAQs:', err);
        setToast({ message: 'Could not load FAQs.', type: 'error' });
      }
    };
    load();
  }, []);

  const filtered = useMemo(
    () => faqs.filter(f => f.question.toLowerCase().includes(search.toLowerCase())),
    [faqs, search]
  );

  const toggle = id => setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden overflow-auto bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/">Home</TopBarButton>
        <TopBarButton to="/faq" active>FAQ</TopBarButton>
      </TopBar>

      <div className="p-6 sm:p-10 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="mb-6">
          <TextInput
            placeholder="Search FAQs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400">No FAQs found.</p>
        ) : (
          filtered.map(faq => (
            <div
              key={faq.id}
              className="bg-bgCard border border-inputBorder rounded-lg shadow-sm mb-4"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex justify-between p-4 hover:bg-inputBg transition-colors"
              >
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                <AiOutlineDown
                  className={`h-5 w-5 transition-transform ${
                    expandedId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`px-4 ${
                  expandedId === faq.id ? 'py-2 max-h-40' : 'max-h-0'
                } overflow-hidden transition-all`}
              >
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))
        )}

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
