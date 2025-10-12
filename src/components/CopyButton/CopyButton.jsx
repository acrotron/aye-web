// components/CopyButton/CopyButton.jsx
import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

/**
 * MUI‑styled copy‑to‑clipboard button.
 * Props:
 *   - content:   text to copy to the clipboard
 *   - className: optional class name for additional styling (passed to `sx`)
 */
const CopyButton = ({ content, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
      <IconButton
        onClick={handleCopy}
        size="small"
        // Preserve any external className via sx (MUI prefers sx over className for styling)
        sx={{ ...(className && { className }) }}
        // Change colour when copied for visual feedback
        color={copied ? 'success' : 'inherit'}
        aria-label={copied ? 'Copied' : 'Copy'}
      >
        {copied ? (
          <CheckIcon fontSize="small" />
        ) : (
          <ContentCopyIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;
