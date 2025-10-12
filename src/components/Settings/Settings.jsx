// components/Settings/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeveloperSettings from './DeveloperSettings';
import './Settings.css';
import { IconButton, List, ListItemButton, ListItemText } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Settings = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('developer');

  return (
    <div className="settings-view">
      <header className="settings-header">
        <h1>Settings</h1>
        {/* MUI back button */}
        <IconButton
          aria-label="Back"
          onClick={() => navigate(-1)}
          size="large"
        >
          <ArrowBackIcon />
        </IconButton>
      </header>

      <div className="settings-container">
        {/* Navigation pane on the left – now MUI List */}
        <nav className="settings-nav">
          <List component="nav" disablePadding>
            <ListItemButton
              selected={activeSection === 'developer'}
              onClick={() => setActiveSection('developer')}
            >
              <ListItemText primary="Developer Settings" />
            </ListItemButton>
            {/* Add more navigation items here as needed */}
          </List>
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
