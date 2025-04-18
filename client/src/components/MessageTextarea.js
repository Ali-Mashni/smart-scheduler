import React from 'react';

export default function MessageTextarea({ name, value, onChange, placeholder }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-md bg-inputBg border border-inputBorder text-white focus:outline-none focus:ring-2 focus:ring-primary"
      rows="4"
    />
  );
}
