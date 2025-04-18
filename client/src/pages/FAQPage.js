import React, { useContext, useState, useMemo } from 'react';
import { FAQContext } from '../context/FAQContext';
import TopBar from '../components/TopBar';
import TopBarButton from '../components/TopBarButton';
import TextInput from '../components/TextInput';
import { AiOutlineDown } from 'react-icons/ai'; 

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

      <div className="p-6 sm:p-10 max-w-3xl mx-auto">
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
              <div
                key={faq.id}
                className="bg-bgCard border border-inputBorder rounded-lg shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center text-left px-4 py-3 focus:outline-none hover:bg-inputBg transition-colors duration-200"
                >
                  <h3 className="text-lg sm:text-xl font-semibold">{faq.question}</h3>
                  <AiOutlineDown
                    className={`h-5 w-5 transition-transform duration-300 ${
                      expandedFAQId === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out px-4 ${
                    expandedFAQId === faq.id ? 'max-h-40 py-2' : 'max-h-0'
                  }`}
                >
                  <p className="text-sm sm:text-base text-gray-300">{faq.answer}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
