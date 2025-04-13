// src/components/FAQForm.js
import React from 'react';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';

export default function FAQForm({ faqEdit, onChange, onSave, onCancel }) {
  return (
    //
    <div>
      <label className="block text-lg font-medium mb-2">Question:</label>
      <TextInput
        name="question"
        value={faqEdit.question}
        onChange={onChange}
        placeholder="Enter FAQ question"
      />
      <label className="block text-lg font-medium mt-4 mb-2">Answer:</label>
      <textarea
        name="answer"
        value={faqEdit.answer}
        onChange={onChange}
        placeholder="Enter FAQ answer"
        className="w-full p-4 mt-1 rounded bg-inputBg border border-inputBorder text-white focus:outline-none focus:ring-2 focus:ring-primary"
        rows="5"
      ></textarea>
      <div className="flex gap-4 mt-6">
        <PrimaryButton onClick={onSave}>Save</PrimaryButton>
        <PrimaryButton onClick={onCancel}>Cancel</PrimaryButton>
      </div>
    </div>
  );
}
