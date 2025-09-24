import { marked } from 'marked';
import CopyButton from '../CopyButton/CopyButton';
import './Message.css';

function Message({ message }) {
  const parseMessageText = (text) => {
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(text);
      // Check if it matches our expected schema
      if (parsed.answer_summary && parsed.source_files) {
        return { __html: formatStructuredResponse(parsed) };
      }
    } catch (e) {
      // Not JSON or doesn't match schema, continue as normal
    }

    if (typeof text === 'string') {
      return { __html: marked.parse(text) };
    }
    return { __html: text };
  };

  const formatStructuredResponse = (response) => {
    let formatted = response.answer_summary;
    
    if (response.source_files && response.source_files.length > 0) {
      formatted += '\n\n';
      formatted += '---\n\n';
      formatted += '\n\n';
      response.source_files.forEach((file, index) => {
        formatted += `**${file.file_name}**\n\n`;
        formatted += '```';
        formatted += file.file_content;
        formatted += '\n\n';
        formatted += '```';
        formatted += '\n\n';
        
        if (index < response.source_files.length - 1) {
          formatted += '---\n\n';
        }
      });
    }
    
    return marked.parse(formatted);
  };

  return (
    <div className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        <div 
          className="message-text" 
          dangerouslySetInnerHTML={parseMessageText(message.text)}
        />
        {message.sender === 'bot' && (
          <CopyButton content={message.text} />
        )}
      </div>
    </div>
  );
}

export default Message;
