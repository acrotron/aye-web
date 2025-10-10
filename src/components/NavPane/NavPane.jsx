// components/NavPane/NavPane.jsx
import React from "react";
import { useChatContext } from "../../context/ChatContext";
import { ProfileMenu } from "../../components/ProfileMenu/ProfileMenu";
import SessionList from "../SessionList/SessionList"; // MUI‑styled session list
import "./NavPane.css";
import { Button } from "@mui/material";

const NavPane = ({ title }) => {
  const {
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
    createNewChat,
    deleteSession,
    setShowSettings,
    setActiveSettingsSection,
  } = useChatContext();

  // Show the first session always; up to five more in the collapsible list.
  const MAX_HIDDEN = 100; // number of sessions inside the expander

  // Open the settings drawer on the current‑chat section
  const openSettingsSection = (section) => {
    setActiveSettingsSection(section);
    setShowSettings(true);
  };

  return (
    <aside className="nav-pane">
      <header className="nav-header">
        <h2>{title}</h2>
        {/* New‑chat button – now an MUI Button */}
        <Button
          onClick={createNewChat}
          variant="contained"
          color="success"
          sx={{
            minWidth: 0,
            width: 40,
            height: 40,
            borderRadius: "50%",
            p: 0,
            textTransform: "none",
          }}
          aria-label="New chat"
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
        </Button>
      </header>

      <hr />

      <div className="nav-content">
        {/* MUI‑styled session list with hidden‑sessions collapse */}
        <SessionList
          sessions={chatSessions}
          currentSessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          deleteSession={deleteSession}
          maxHidden={MAX_HIDDEN}
          openSettings={() => openSettingsSection('currentChat')}
        />

        {/* Profile menu – now rendered */}
        <ProfileMenu />
      </div>
    </aside>
  );
};

export default NavPane;
