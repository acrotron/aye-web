// components/InfoHeader/InfoHeader.jsx
import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

/**
 * Header for the Additional‑Info pane.
 * Uses MUI `Box` for layout and an `IconButton` to clear all items.
 */
const InfoHeader = ({ onClearAll }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderBottom: '1px solid var(--info-header-border)',
        backgroundColor: 'var(--info-header-bg)',
        color: '#fff',
      }}
    >
      <Typography variant="h6" component="h3" sx={{ color: '#fff' }}>
        Additional Information
      </Typography>
      {onClearAll && (
        <Tooltip title="Clear all">
          <IconButton
            size="small"
            onClick={onClearAll}
            sx={{ color: '#fff' }}
            aria-label="clear all"
          >
            <DeleteSweepIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default InfoHeader;
