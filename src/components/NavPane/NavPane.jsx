import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import { ProfileMenu } from "../../components/ProfileMenu/ProfileMenu";
import ChatSessionSettingsDrawer from "../ChatSessionSettingsDrawer/ChatSessionSettingsDrawer";

import "./NavPane.css";

const NavPane = ({ title }) => {
  const {
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
    createNewChat,
    deleteSession,
    user,
    signOut,
    setShowSettings,
    setActiveSettingsSection
  } = useChatContext();

  // ----- show first 5 + the rest in a collapsible list -----
  const MAX_VISIBLE = 1;
  const visibleSessions = chatSessions.slice(0, MAX_VISIBLE);
  const hiddenSessions = chatSessions.slice(MAX_VISIBLE);

  const [showMore, setShowMore] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false); // ← new

  const renderSession = (session) => (
    <div
      key={session.id}
      className={`chat-session ${
        session.id === currentSessionId ? "active" : ""
      }`}
      onClick={() => setCurrentSessionId(session.id)}
    >
      <div className="session-info">
        <div className="session-name">{session.name}</div>
      </div>
      <button
        className="delete-session-btn"
        onClick={(e) => deleteSession(session.id, e)}
      >
        ✕
      </button>
    </div>
  );

  // Function to open settings drawer with specific section
  const openSettingsSection = (section) => {
    setActiveSettingsSection(section);
    setShowSettings(true);
  };

  return (
    <aside className="nav-pane">
      <header className="nav-header">
        <h2>{title}</h2>

        <button
          className="new-chat-btn"
          onClick={createNewChat}
          type="button"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="1" y1="12" x2="23" y2="12"></line>
            <line x1="12" y1="1" x2="12" y2="23"></line>
          </svg>
        </button>
      </header>

      <div className="nav-content">
        {/* ---- always‑visible sessions ---- */}
        {visibleSessions.map(renderSession)}

        {/* ----- New button that opens the session‑settings drawer ----- */}
        <button
          className="session-settings-btn"
          onClick={() => openSettingsSection('model')}
          title="Chat session settings"
        >
        ⛭ Model and System Prompt
        </button> 

        <hr />

        {/* ---- dropdown trigger (only if there are hidden ones) ---- */}
        {hiddenSessions.length > 0 && (
          <div className="more-wrapper">
            <button
              className="more-btn"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? "▲ Show less" : `▼ ${hiddenSessions.length} more`}
            </button>

            {/* ---- hidden sessions list (scrollable when needed) ---- */}
            {showMore && (
              <div className="hidden-sessions">
                {hiddenSessions.map(renderSession)}
              </div>
            )}
          </div>
        )}

        <ProfileMenu />
      </div>

      {/* -------------------------------------------------------------
         Floating drawer – it contains the Model selector and the System
         Prompt editor.  It is rendered only when `showChatSettings`
         is true.
         ------------------------------------------------------------- */}
      {showChatSettings && (
        <ChatSessionSettingsDrawer
          onClose={() => setShowChatSettings(false)}
        />
      )}
    </aside>
  );
};

export default NavPane;
