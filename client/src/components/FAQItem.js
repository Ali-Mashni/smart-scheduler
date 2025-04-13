// src/components/FAQItem.js
import React from 'react';

export default function FAQItem({ faq, isSelected, onSelect }) {
  return (
    <li
      onClick={() => onSelect(faq.id)}
      className={`cursor-pointer border rounded p-3 hover:bg-gray-800 transition-colors ${
        isSelected ? 'bg-primary' : ''
      }`}
    >
      {faq.question || 'Untitled FAQ'}
    </li>
  );
}
//
