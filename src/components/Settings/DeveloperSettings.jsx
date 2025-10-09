import React, { useState } from 'react';
import { usePersonalToken } from '../../hooks/usePersonalToken';
import './DeveloperSettings.css';

const DeveloperSettings = () => {
  // Hook supplies everything we need.
  const { token, loading, error, getToken } = usePersonalToken();

  const [showToken, setShowToken] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    // optional: toast/notification here
  };

  return (
    <div className="developer-settings-container">
      <div className="token-section">
        <h2 className="section-title">Personal Access Token</h2>
        <p className="section-description">Use this token to authenticate with our CLI tool.</p>

        <button className="generate-token-btn" onClick={getToken} disabled={loading}>
          {loading ? 'Generating Token…' : 'Generate Personal Access Token'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {token && (
          <div className="token-display">
            <div className="token-value">
              <code className="token-text">
                {showToken ? token : '••••••••••••••••••••'}
              </code>
              <button className="toggle-visibility-btn" onClick={() => setShowToken(!showToken)}>
                {showToken ? 'Hide' : 'Show'}
              </button>
            </div>
            <button 
              className="copy-token-btn" 
              onClick={handleCopyToken}
              disabled={isCopied}
            >
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperSettings;