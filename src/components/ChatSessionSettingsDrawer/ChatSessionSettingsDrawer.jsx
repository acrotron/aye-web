// src/components/ChatSessionSettingsDrawer/ChatSessionSettingsDrawer.jsx
import React, { useState, useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import ModelSelector from "../ModelSelector/ModelSelector";
import SystemPromptEditor from "../SystemPromptEditor/SystemPromptEditor";
import { AVAILABLE_MODELS } from "../../config/models";
import "./ChatSessionSettingsDrawer.css";

const ANIMATION_DURATION = 220; // ms – must match the CSS animation time

const ChatSessionSettingsDrawer = ({ onClose }) => {
  const {
    selectedModel,
    setSelectedModel,
    systemPrompt,
    setSystemPrompt,
  } = useChatContext();

  // -----------------------------------------------
  // 1️⃣ Closing state – true while the slide‑out runs
  // -----------------------------------------------
  const [isClosing, setIsClosing] = useState(false);

  // -------------------------------------------------
  // Close handler – start the slide‑out animation,
  // then wait for the animation to finish before calling the parent.
  // -------------------------------------------------
  const handleClose = () => {
    setIsClosing(true);                // start slide‑out CSS
  };

  // After the animation finishes, tell the parent to actually remove us.
  useEffect(() => {
    if (!isClosing) return;
    const timer = setTimeout(() => {
      onClose();                       // parent removes the drawer from the tree
    }, ANIMATION_DURATION);
    return () => clearTimeout(timer);
  }, [isClosing, onClose]);

  // Prevent clicks inside the drawer from bubbling up to the backdrop.
  const stopPropagation = (e) => e.stopPropagation();

  return (
    // Backdrop – click outside the drawer triggers the close animation
    <div className="session-settings-backdrop" onClick={handleClose}>
      {/* Drawer panel – apply a CSS class based on `isClosing` */}
      <div
        className={`session-settings-drawer ${
          isClosing ? "closing" : "opening"
        }`}
        onClick={stopPropagation}
      >
        <header className="session-settings-header">
          <h1>Chat Session Settings</h1>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </header>

        <main className="session-settings-content">
          {/* Model selector */}
          <section className="settings-section">
            <h2 className="section-title">Model</h2>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              availableModels={AVAILABLE_MODELS}
            />
          </section>

          {/* System Prompt editor */}
          <section className="settings-section">
            <h2 className="section-title">System Prompt</h2>
            <SystemPromptEditor
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default ChatSessionSettingsDrawer;

