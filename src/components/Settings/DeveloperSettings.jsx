import React, { useState } from 'react';
import { usePersonalToken } from '../../hooks/usePersonalToken';

const DeveloperSettings = () => {
  // Hook supplies everything we need.
  const { token, loading, error, getToken } = usePersonalToken();

  const [showToken, setShowToken] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token);
    // optional: toast/notification here
  };

  return (
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
  );
};

export default DeveloperSettings;
