import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeveloperSettings from './DeveloperSettings';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('developer');

  return (
    <div className="settings-view">
      <header className="settings-header">
        <h1>Settings</h1>
        <button className="close-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </header>

      <div className="settings-container">
        {/* Navigation pane on the left */}
        <nav className="settings-nav">
          <button 
            className={`nav-item ${activeSection === 'developer' ? 'active' : ''}`}
            onClick={() => setActiveSection('developer')}
          >
            Developer Settings
          </button>
          {/* Add more navigation items here as needed */}
        </nav>

        {/* Main content area on the right */}
        <main className="settings-content">
          {activeSection === 'developer' && <DeveloperSettings />}
        </main>
      </div>
    </div>
  );
};

export default Settings;
