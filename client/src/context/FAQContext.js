import React, { createContext, useReducer } from 'react';

export const FAQContext = createContext();

const initialState = [
  {
    id: 1,
    question: 'How do I update my schedule?',
    answer: 'Navigate to your profile and click "Edit Schedule".',
  },
  {
    id: 2,
    question: 'What is the deadline for assignments?',
    answer: 'Check the course page for upcoming deadlines.',
  },
  {
    id: 3,
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page and follow the steps.',
  },
];

function faqReducer(state, action) {
  switch (action.type) {
    case 'ADD_FAQ':
      return [action.payload, ...state];

    case 'UPDATE_FAQ':
      return state.map(faq =>
        faq.id === action.payload.id ? action.payload : faq
      );

    case 'DELETE_FAQ':
      return state.filter(faq => faq.id !== action.payload);

    default:
      return state;
  }
}

export const FAQProvider = ({ children }) => {
  const [faqs, dispatch] = useReducer(faqReducer, initialState);

  const addFAQ = (faq) => dispatch({ type: 'ADD_FAQ', payload: faq });
  const updateFAQ = (id, updatedFAQ) =>
    dispatch({ type: 'UPDATE_FAQ', payload: { ...updatedFAQ, id } });
  const deleteFAQ = (id) => dispatch({ type: 'DELETE_FAQ', payload: id });

  return (
    <FAQContext.Provider value={{ faqs, addFAQ, updateFAQ, deleteFAQ }}>
      {children}
    </FAQContext.Provider>
  );
};
