import React from 'react';
import { useChatContext } from '../../context/ChatContext';
// Header removed – the title is no longer displayed in the central pane
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import ChatInput from '../ChatInput/ChatInput';
import './ChatPane.css';

const ChatPane = ({ style }) => {
  const { getCurrentSession, sendMessage } = useChatContext();
  const currentSession = getCurrentSession();

  return (
    <div className="chat-pane" style={style}>
      {/* Header removed */}
      <MessagesContainer />
      <ChatInput onMessageSubmitted={sendMessage} />
    </div>
  );
};

export default ChatPane;
