// components/Message/Message.jsx
import React from 'react';
import Grid from '@mui/material/Grid';
import { marked } from 'marked';
import CopyButton from '../CopyButton/CopyButton';
import { Box, Card, CardContent, Typography } from '@mui/material';

/**
 * Renders a single chat message.
 * Uses MUI `Card` for the bubble and `Box` for layout.
 * Styling is driven by CSS variables defined in `app.css` (or the MUI theme).
 */
const Message = ({ message }) => {
  // Parse markdown or JSON‑structured response
  const parseMessageText = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (parsed.answer_summary && parsed.source_files) {
        return { __html: formatStructuredResponse(parsed) };
      }
    } catch (e) {
      // not JSON – fall back to plain markdown
    }
    if (typeof text === 'string') {
      return { __html: marked.parse(text) };
    }
    return { __html: text };
  };

  const formatStructuredResponse = (response) => {
    let formatted = response.answer_summary;
    if (response.source_files && response.source_files.length > 0) {
      formatted += '\n\n---\n\n';
      response.source_files.forEach((file, index) => {
        formatted += `**${file.file_name}**\n\n`;
        formatted += '```';
        formatted += file.file_content;
        formatted += '\n\n```\n\n';
        if (index < response.source_files.length - 1) {
          formatted += '---\n\n';
        }
      });
    }
    return marked.parse(formatted);
  };

  const isUser = message.sender === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        my: 1,
      }}
    >
      <Card
        sx={{
          maxWidth: '85%',
          backgroundColor: isUser ? 'var(--user-msg-bg)' : 'var(--bot-msg-bg)',
          color: isUser ? 'inherit' : 'var(--bot-msg-color)',
          border: isUser ? '1px solid var(--user-msg-border)' : '1px solid var(--bot-msg-border)',
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <CardContent sx={{ p: 2, position: 'relative' }}>
          <Typography
            component="div"
            variant="body2"
            sx={{ lineHeight: 1.5, wordBreak: 'break-word' }}
            dangerouslySetInnerHTML={parseMessageText(message.text)}
          />
        </CardContent>
        <Grid
          container
          direction='Row'
          sx={{
            justifyContent: isUser ? 'right' : 'space-between', //Separates copy button and time for bot, moves time to right for user (since there's no copy button for user)
            alignItems: 'center', //'center' or 'end'? end aligns time to button but center might look better
            px: 2,
            pb: 1,
          }}
        >
        {/* Show copy button only for assistant messages (as before) */}
          {message.sender === 'bot' && (
              <CopyButton 
                  content={message.text}/>
              )}
          <Typography
            variant="body3" 
            sx={{
              fontSize: '0.75rem',
              opacity: 0.6,
            }}
          >{new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}</Typography>
        </Grid>
      </Card>
    </Box>
  );
};

export default Message;
