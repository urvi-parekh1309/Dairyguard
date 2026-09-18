import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Stylesheets
import './styles/design-tokens.css';
import './styles/main.css';
import './styles/components.css';
import './styles/dashboard.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
