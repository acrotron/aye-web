import React, { useRef } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Routes, Route } from 'react-router-dom';

import { ChatProvider } from './context/ChatContext';
import { ChatService } from './services/ChatService';
import { HuggingfaceService } from './services/huggingface.service';
import { useResizablePanes } from './hooks/useResizablePanes';
import AppContent from './components/AppContent';

import './app.css';

function App({ user, signOut }) {
  const title = 'AI Assistant';
  const chatService = useRef(new ChatService(new HuggingfaceService()));
  const resizablePanes = useResizablePanes();

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <ChatProvider user={user} signOut={signOut} chatService={chatService.current}>
          <Routes>
            {/* Chat UI */}
            <Route
              path="/"
              element={
                <AppContent
                  title={title}
                  resizablePanes={resizablePanes}
                  user={user}
                  signOut={signOut}
                />
              }
            />

            {/* Settings route removed - now handled by sliding drawer */}
          </Routes>
        </ChatProvider>
      )}
    </Authenticator>
  );
}

export default App;
