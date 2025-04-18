// src/components/RequestForm.js
import React from 'react';
import TextInput from './TextInput';
import PrimaryButton from './PrimaryButton';

export default function RequestForm({ form, onChange, onSubmit, error }) {
  return (
    <div className="bg-bgCard p-8 rounded-xl shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Contact Customer Service</h2>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <TextInput
          placeholder="Your Name"
          name="name"
          value={form.name}
          onChange={onChange}
        />
        <TextInput
          placeholder="Your Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
        />
        <TextInput
          placeholder="Subject"
          name="subject"
          value={form.subject}
          onChange={onChange}
        />
        <textarea
          placeholder="Message"
          name="message"
          value={form.message}
          onChange={onChange}
          className="w-full px-4 py-2 rounded-md bg-inputBg border border-inputBorder text-white focus:outline-none focus:ring-2 focus:ring-primary"
          rows="4"
        ></textarea>
        <PrimaryButton type="submit">Send Message</PrimaryButton>
      </form>
    </div>
  );
}
