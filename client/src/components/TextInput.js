import React from 'react';

export default function TextInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-md bg-inputBg border border-inputBorder text-white focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}
