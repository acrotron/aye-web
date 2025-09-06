import { marked } from 'marked';
import './Message.css';

function Message({ message }) {
  const parseMessageText = (text) => {
    if (typeof text === 'string') {
      return { __html: marked.parse(text) };
    }
    return { __html: text };
  };

  return (
    <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        <div 
          className="message-text" 
          dangerouslySetInnerHTML={parseMessageText(message.text)}
        />
      </div>
    </div>
  );
}

export default Message;

