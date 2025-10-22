import React from 'react';
import { createRoot } from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import App from './App.jsx';
import awsconfig from './environments/aws-exports';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

// Apply Umami telemetrics
const head = document.getElementsByTagName('head')[0];
if (head) {
  const analyticsId = import.meta.env.VITE_ANALYTICS_ID || 'NONE';
  if (analyticsId !== 'NONE') {
    const script = document.createElement('script');
    script.src = 'https://cloud.umami.is/script.js';
    script.defer = true;
    script.setAttribute('data-website-id', analyticsId);
    head.appendChild(script);
  }
} else {
  console.log("Head element NOT found");
}

// main
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
