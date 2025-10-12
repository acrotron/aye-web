// components/Settings/DeveloperSettings.jsx
import React, { useState } from 'react';
import { usePersonalToken } from '../../hooks/usePersonalToken';
import './DeveloperSettings.css';
import { Button } from '@mui/material';

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

        {/* Generate token button – MUI Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={getToken}
          disabled={loading}
          sx={{ mb: 2, width: '100%' }}
        >
          {loading ? 'Generating Token…' : 'Generate Personal Access Token'}
        </Button>

        {error && <div className="error-message">{error}</div>}

        {token && (
          <div className="token-display">
            <div className="token-value">
              <code className="token-text">
                {showToken ? token : '••••••••••••••••••••'}
              </code>
              {/* Toggle visibility – MUI Button */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowToken(!showToken)}
                sx={{ ml: 1 }}
              >
                {showToken ? 'Hide' : 'Show'}
              </Button>
            </div>
            {/* Copy token – MUI Button */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCopyToken}
              disabled={isCopied}
              sx={{ mt: 1, width: '100%' }}
            >
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperSettings;
