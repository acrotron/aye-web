import React, { useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import Message from '../Message/Message';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import './MessagesContainer.css';

const MessagesContainer = () => {
  const { messages, isTyping } = useChatContext();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-container" id="messages-container">
      {messages.map((msg, i) => (
        <Message key={i} message={msg} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;