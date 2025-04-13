import React, { createContext, useState } from 'react';

export const FAQContext = createContext();

export const FAQProvider = ({ children }) => {
  // Start with initial FAQs.
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'How do I update my schedule?',
      answer: 'Navigate to your profile and click "Edit Schedule".'
    },
    {
      id: 2,
      question: 'What is the deadline for assignments?',
      answer: 'Check the course page for upcoming deadlines.'
    },
    {
      id: 3,
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the steps.'
    },
  ]);

  const addFAQ = (faq) => {
    setFaqs(prev => [faq, ...prev]);
  };

  const updateFAQ = (id, updatedFAQ) => {
    setFaqs(prev => prev.map(faq => faq.id === id ? updatedFAQ : faq));
  };

  const deleteFAQ = (id) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
  };

  return (
    <FAQContext.Provider value={{ faqs, addFAQ, updateFAQ, deleteFAQ }}>
      {children}
    </FAQContext.Provider>
  );
};
