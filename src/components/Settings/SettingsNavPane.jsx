import React from 'react';

const SettingsNavPane = ({ currentSection, onSectionChange }) => {
  return (
    <nav className="settings-nav">
      <button 
        className={`nav-item ${currentSection === 'currentChat' ? 'active' : ''}`}
        onClick={() => onSectionChange('currentChat')}
      >
        Current Chat
      </button>
      <button 
        className={`nav-item ${currentSection === 'developer' ? 'active' : ''}`}
        onClick={() => onSectionChange('developer')}
      >
        Developer Settings
      </button>
    </nav>
  );
};

export default SettingsNavPane;