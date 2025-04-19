import React from 'react';
import { Link } from 'react-router-dom';

export default function TopBarButton(props) {
  return (
    <Link
      to={props.to || '#'}
      className={`relative inline-flex items-center px-2 text-sm sm:text-base text-gray-300 hover:text-white font-medium transition-colors duration-200 ${
        props.active ? 'text-white font-semibold' : ''
      }`}
    >
      {/* Wrap the children in a span to prevent line breaks */}
      <span className="whitespace-nowrap">{props.children}</span>
      <span
        className={`absolute left-0 -bottom-1 w-full h-0.5 rounded bg-primary transition-opacity duration-300 ${
          props.active ? 'opacity-100' : 'opacity-0 hover:opacity-100'
        }`}
      />
    </Link>
  );
}
