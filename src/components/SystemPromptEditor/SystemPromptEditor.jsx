// components/SystemPromptEditor/SystemPromptEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * System prompt editor using MUI controls.
 *
 * Props:
 *   - systemPrompt: current prompt string
 *   - onSystemPromptChange: callback to update the prompt in parent context
 */
const SystemPromptEditor = ({ systemPrompt, onSystemPromptChange }) => {
  // UI state – whether the accordion is expanded
  const [isExpanded, setIsExpanded] = useState(true);

  // Keep a copy of the prompt as it was when the editor opened.
  const originalRef = useRef(systemPrompt);

  // When the editor is opened we capture the current prompt.
  const handleToggle = (event, expanded) => {
    setIsExpanded(expanded);
    if (expanded) {
      originalRef.current = systemPrompt; // remember value at open time
    }
  };

  // Every keystroke updates the global prompt immediately.
  const handleChange = (e) => {
    onSystemPromptChange(e.target.value);
  };

  // Cancel → restore the value that was saved when the editor opened.
  const handleCancel = () => {
    onSystemPromptChange(originalRef.current);
  };

  // Save → just close the editor (the prompt is already stored).
  const handleSave = () => {
    setIsExpanded(false);
  };

  // Keyboard shortcuts (Esc = cancel, Ctrl/Cmd+Enter = save)
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCancel();
    }
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  // Keep the internal ref in sync when the *prop* changes while the editor is closed.
  useEffect(() => {
    if (!isExpanded) {
      originalRef.current = systemPrompt;
    }
  }, [systemPrompt, isExpanded]);

  return (
    <Accordion expanded={isExpanded} onChange={handleToggle} sx={{ mb: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="system-prompt-content"
        id="system-prompt-header"
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "text.secondary",
          }}
        >
          System Prompt
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          multiline
          minRows={4}
          value={systemPrompt}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter your system prompt here..."
          variant="outlined"
          fullWidth
        />
        {/*
        // The original UI had explicit Save/Cancel buttons, but they were commented out.
        // If you later need them, you can re‑introduce MUI Buttons here.
        */}
      </AccordionDetails>
    </Accordion>
  );
};

export default SystemPromptEditor;
