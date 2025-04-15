import React from 'react';

export default function FAQItem({ faq, isSelected, onSelect }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelect(faq.id);
    }
  };
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => onSelect(faq.id)}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer border rounded p-3 hover:bg-gray-800 transition-colors outline-none ${
        isSelected ? 'bg-primary' : ''
      }`}
    >
      {faq.question?.trim() || 'Untitled FAQ'}
    </li>
  );
}