import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const originalFetch = window.fetch;
const BASE_URL = process.env.REACT_APP_API_URL || 'https://smart-scheduler-backend.onrender.com';

console.log("Fetch base URL:", BASE_URL); // confirm in browser

window.fetch = (input, init) => {
  if (typeof input === 'string' && input.startsWith('/api/')) {
    input = `${BASE_URL}${input}`;
  } else if (input instanceof Request && input.url.startsWith('/api/')) {
    input = new Request(`${BASE_URL}${input.url}`, input);
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
