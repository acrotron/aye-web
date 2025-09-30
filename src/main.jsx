import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import awsconfig from './environments/aws-exports';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

