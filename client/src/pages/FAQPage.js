// src/pages/FAQPage.js
import React, { useContext, useState, useMemo } from 'react';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TextInput from '../components/TextInput';
import { FAQContext } from '../context/FAQContext';

export default function FAQPage() {
  const { faqs } = useContext(FAQContext);
  const [search, setSearch] = useState('');
  const [expandedFAQId, setExpandedFAQId] = useState(null);

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [faqs, search]);

  const toggleFAQ = (id) => {
    setExpandedFAQId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-bgMain text-white">
      <TopBar>
        <TopBarButton to="/">Home</TopBarButton>
        <TopBarButton to="/faq" active>FAQ</TopBarButton>
      </TopBar>
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="mb-6">
          <TextInput
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <p className="text-gray-400">No FAQs found.</p>
          ) : (
            filteredFAQs.map((faq) => (
              <div key={faq.id} className="border rounded p-4 bg-bgCard">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left focus:outline-none"
                >
                  <h3 className="text-xl font-bold">{faq.question}</h3>
                </button>
                {expandedFAQId === faq.id && (
                  <p className="mt-2 text-lg">{faq.answer}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
