//src/components/Settings/Settings.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  return (

  <div className="settings-view">
    <header className="settings-header">
      <h1>Settings</h1>
      {/* a simple “Back” button – you can replace it with an icon later */}
      <button className="close-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </header>

    <main className="settings-content">
      {/* Placeholder – put real settings UI here later */}
      <p>This is where you will add your settings controls.</p>
    </main>
  </div>
  );
}

export default Settings;

