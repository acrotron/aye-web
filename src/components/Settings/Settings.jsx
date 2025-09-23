// src/components/Settings/Settings.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePersonalToken } from '../../hooks/usePersonalToken';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();

  // Hook supplies everything we need.
  const { token, loading, error, getToken } = usePersonalToken();

  const [showToken, setShowToken] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    // optional: toast/notification here
  };

  return (
    <div className="settings-view">
      <header className="settings-header">
        <h1>Settings</h1>
        <button className="close-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </header>

      <main className="settings-content">
        <p>This is where you will add your settings controls.</p>

        {/* Personal Access Token Section */}
        <div className="token-section">
          <h3>Personal Access Token</h3>
          <p>Use this token to authenticate with our CLI tool.</p>

          <button onClick={getToken} disabled={loading}>
            {loading ? 'Generating Token…' : 'Generate Personal Access Token'}
          </button>

          {error && <div className="error-message">{error}</div>}

          {token && (
            <div className="token-display">
              <div className="token-value">
                {showToken ? token : '••••••••••••••••••••'}
                <button onClick={() => setShowToken(!showToken)}>
                  {showToken ? 'Hide' : 'Show'}
                </button>
              </div>
              <button onClick={handleCopyToken}>Copy to Clipboard</button>
            </div>
          )}
        </div>
      </main>
    </div>
  
  );
};

export default Settings;
