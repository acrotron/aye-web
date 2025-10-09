import React, { useState, useRef, useEffect } from "react";
import "./SystemPromptEditor.css";

/**
 * Stateless editor – it receives the current prompt (`systemPrompt`)
 * and a setter (`onSystemPromptChange`) from the parent (ChatContext).
 *
 * The component itself only stores UI‑only state (`isExpanded`) and a ref
 * (`originalRef`) that lets us revert to the original prompt on Cancel.
 */
const SystemPromptEditor = ({ systemPrompt, onSystemPromptChange }) => {
  /* -------------------------------------------------------------
   * UI state – is the editor open or closed?
   * ------------------------------------------------------------- */
  const [isExpanded, setIsExpanded] = useState(true);

  /* -------------------------------------------------------------
   * Keep a copy of the prompt *as it was when the editor opened*.
   * Using a ref means we don’t introduce extra React state.
   * ------------------------------------------------------------- */
  const originalRef = useRef(systemPrompt);

  // When the editor is opened we capture the current prompt.
  const handleToggle = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) {
        originalRef.current = systemPrompt; // remember value at open time
      }
      return next;
    });
  };

  // -------------------------------------------------------------
  // Every keystroke updates the global prompt immediately.
  // -------------------------------------------------------------
  const handleChange = (e) => {
    onSystemPromptChange(e.target.value);
  };

  // -------------------------------------------------------------
  // Cancel → restore the value that was saved when the editor opened.
  // -------------------------------------------------------------
  const handleCancel = () => {
    onSystemPromptChange(originalRef.current);
    //setIsExpanded(false);
  };

  // -------------------------------------------------------------
  // Save → just close the editor (the prompt is already stored).
  // -------------------------------------------------------------
  const handleSave = () => {
    //setIsExpanded(false);
  };

  // -------------------------------------------------------------
  // Keyboard shortcuts (Esc = cancel, Ctrl/Cmd+Enter = save)
  // -------------------------------------------------------------
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleCancel();
    }
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleSave();
    }
  };

  /* -------------------------------------------------------------
   * Keep the internal ref in sync when the *prop* changes while the
   * editor is **closed** – this prevents a stale value being restored
   * after a session switch.
   * ------------------------------------------------------------- */
  useEffect(() => {
    if (!isExpanded) {
      originalRef.current = systemPrompt;
    }
  }, [systemPrompt, isExpanded]);

  return (
    <div className="system-prompt-editor">
      {/* Header – click to expand / collapse */}
      <div className="system-prompt-header" onClick={handleToggle}>
        <span className="system-prompt-label">System Prompt</span>
        <span className={`expand-icon ${isExpanded ? "expanded" : ""}`}>
          ▼
        </span>
      </div>

      {/* Expanded editor */}
      {isExpanded && (
        <div className="system-prompt-content">
          <textarea
            className="system-prompt-textarea"
            value={systemPrompt}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your system prompt here..."
            rows="4"
          />

          {/*
          <div className="system-prompt-actions">
            <button
              className="system-prompt-btn save-btn"
              onClick={handleSave}
              type="button"
            >
              Save
            </button>
            <button
              className="system-prompt-btn cancel-btn"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
          </div>
          <div className="system-prompt-hint">
            Tip: Ctrl+Enter to save, Esc to cancel
          </div>
          */}
        </div>
      )}
    </div>
  );
};

export default SystemPromptEditor;

