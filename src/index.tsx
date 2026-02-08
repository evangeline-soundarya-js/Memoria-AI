import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global shim for SDK requirement
(window as any).process = (window as any).process || { env: {} };

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
