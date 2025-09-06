import { useState, useRef, useEffect } from 'react';
import './ChatInput.css';

function ChatInput({ onMessageSubmitted }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);
  const maxLines = 5;
  const lineHeight = 24;

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  const onInput = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      onMessageSubmitted(message.trim());
      setMessage('');
      setTimeout(adjustTextareaHeight, 0);
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const contentHeight = textarea.scrollHeight;
    const minHeight = 40;
    const maxHeight = maxLines * lineHeight + 16;

    if (contentHeight <= maxHeight) {
      textarea.style.height = Math.max(contentHeight, minHeight) + 'px';
      textarea.classList.remove('scrollable');
    } else {
      textarea.style.height = maxHeight + 'px';
      textarea.classList.add('scrollable');
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        ref={textareaRef}
        className="chat-input"
        placeholder="Type your message..."
        value={message}
        onChange={onInput}
        onKeyDown={onKeyDown}
        rows="1"
      />
      <button
        className="send-button"
        onClick={sendMessage}
        disabled={!message.trim()}
        type="button"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22,2 15,22 11,13 2,9"></polygon>
        </svg>
      </button>
    </div>
  );
}

export default ChatInput;

