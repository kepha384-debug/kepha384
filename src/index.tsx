
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './LanguageContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
// Le StrictMode est retiré volontairement car il provoque des doubles rendus
// qui font planter le widget Google Traduction (conflit de modification du DOM).
root.render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
