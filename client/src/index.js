import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ✅ GLOBAL FETCH PATCH for "api/..." to use backend base URL
const originalFetch = window.fetch;
const BASE_URL = process.env.REACT_APP_API_URL;

window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('api/')) {
    input = `${BASE_URL}/${input.replace(/^\/+/, '')}`;
  } else if (input instanceof Request && input.url.startsWith('api/')) {
    input = new Request(`${BASE_URL}/${input.url}`, input);
  }
  return originalFetch(input, init);
};

// ✅ React entry point
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
