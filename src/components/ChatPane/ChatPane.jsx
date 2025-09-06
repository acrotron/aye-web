import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import ChatInput from '../ChatInput/ChatInput';
import './ChatPane.css';

const ChatPane = ({ style }) => {
  const { getCurrentSession, sendMessage } = useChatContext();
  const currentSession = getCurrentSession();

  return (
    <div className="chat-pane" style={style}>
      <ChatHeader session={currentSession} />
      <MessagesContainer />
      <ChatInput onMessageSubmitted={sendMessage} />
    </div>
  );
};

export default ChatPane;

