import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ session }) => {
  return (
    <div className="chat-header">
      <h1>{session?.name || 'Chat'}</h1>
      <div className="header-actions">
        {/* Optional buttons can go here */}
      </div>
    </div>
  );
};

export default ChatHeader;

