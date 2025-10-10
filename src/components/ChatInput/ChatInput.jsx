// components/ChatInput/ChatInput.jsx
import { useState, useRef, useEffect } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";

/**
 * Chat input component – now fully styled with MUI controls.
 *
 * Behaviour:
 *   • Multiline TextField that grows up to `maxRows` (5).
 *   • `Enter` (without Shift) sends the message.
 *   • Send button is an MUI IconButton with the same SVG icon.
 */
function ChatInput({ onMessageSubmitted }) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);
  const maxRows = 5; // matches previous maxLines

  // Adjust height on mount – same effect as before (keeps auto‑grow).
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  const onInput = (e) => {
    setMessage(e.target.value);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      onMessageSubmitted(message.trim());
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 2,
        backgroundColor: "var(--chat-bg)",
      }}
    >
      <TextField
        inputRef={textareaRef}
        multiline
        minRows={1}
        maxRows={maxRows}
        variant="outlined"
        placeholder="Type your message..."
        value={message}
        onChange={onInput}
        onKeyDown={onKeyDown}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderColor: "var(--chat-input-border)",
            backgroundColor: "var(--chat-input-bg)",
            borderRadius: 2,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--chat-input-border)",
          },
          "&:hover .MuiOutlinedInput-root": {
            borderColor: "var(--chat-input-border)",
          },
          "& .MuiInputBase-input": {
            fontSize: "0.95rem", // ← increased a hair
            lineHeight: 1.5,
          },
        }}
      />
      <Tooltip title="Send">
        <IconButton
          onClick={sendMessage}
          disabled={!message.trim()}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "var(--primary-bg)",
            color: "#fff",
            "&:hover": { bgcolor: "var(--primary-bg-hover)" },
            mb: 1, // ← push button up ~10px from the bottom
          }}
          aria-label="send"
        >
          {/* Same SVG as before */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9"></polygon>
          </svg>
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default ChatInput;
