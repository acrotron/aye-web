// src/components/ChatSessionSettingsDrawer/ChatSessionSettingsDrawer.jsx
import React, { useState, useEffect } from "react";
import { useChatContext } from "../../context/ChatContext";
import ModelSelector from "../ModelSelector/ModelSelector";
import SystemPromptEditor from "../SystemPromptEditor/SystemPromptEditor";
import DeveloperSettings from "../Settings/DeveloperSettings";
import { AVAILABLE_MODELS } from "../../config/models";
import "./ChatSessionSettingsDrawer.css";

const ANIMATION_DURATION = 220; // ms – must match the CSS animation time

const ChatSessionSettingsDrawer = ({ onClose, initialSection = 'model' }) => {
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
  const [currentSection, setCurrentSection] = useState(initialSection);

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

  const renderSection = () => {
    switch (currentSection) {
      case 'model':
        return (
          <section className="settings-section">
            <h2 className="section-title">Model</h2>
            <ModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              availableModels={AVAILABLE_MODELS}
            />
          </section>
        );
      case 'prompt':
        return (
          <section className="settings-section">
            <h2 className="section-title">System Prompt</h2>
            <SystemPromptEditor
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />
          </section>
        );
      case 'developer':
        return (
          <section className="settings-section">
            <h2 className="section-title">Developer Settings</h2>
            <DeveloperSettings />
          </section>
        );
      default:
        return null;
    }
  };

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
          <h1>Settings</h1>
          <button className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </header>

        <nav className="settings-nav">
          <button 
            className={`nav-item ${currentSection === 'model' ? 'active' : ''}`}
            onClick={() => setCurrentSection('model')}
          >
            Model Settings
          </button>
          <button 
            className={`nav-item ${currentSection === 'prompt' ? 'active' : ''}`}
            onClick={() => setCurrentSection('prompt')}
          >
            System Prompt
          </button>
          <button 
            className={`nav-item ${currentSection === 'developer' ? 'active' : ''}`}
            onClick={() => setCurrentSection('developer')}
          >
            Developer Settings
          </button>
        </nav>

        <main className="session-settings-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default ChatSessionSettingsDrawer;