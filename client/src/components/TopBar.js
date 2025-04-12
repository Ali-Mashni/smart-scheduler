import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function TopBar({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-bgMain shadow-md px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo with link to home */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform hover:scale-105"
          />
        </Link>

        {/* Desktop nav (centered) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-6">
          {children}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 items-center">
          {children}
        </div>
      )}
    </div>
  );
}
