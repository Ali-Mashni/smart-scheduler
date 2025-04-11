import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function PasswordInput({ value, onChange, placeholder, name }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md bg-inputBg border border-inputBorder text-white focus:outline-none focus:ring-2 focus:ring-primary pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
      >
        {show ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
      </button>
    </div>
  );
}
