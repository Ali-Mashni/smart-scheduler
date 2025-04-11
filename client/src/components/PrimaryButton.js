import React from 'react';

export default function PrimaryButton({ children, type = 'button', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-primary hover:bg-primaryHover transition text-white py-2 rounded-md font-semibold"
    >
      {children}
    </button>
  );
}
