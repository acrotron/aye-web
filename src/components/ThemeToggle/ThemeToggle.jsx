// src/components/ThemeToggle/ThemeToggle.jsx
import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Brightness7 as SunIcon, Brightness4 as MoonIcon } from '@mui/icons-material';
import { useThemeContext } from '../../context/ThemeContext';

/**
 * Simple toggle button that switches between light and dark mode.
 * Displays a sun icon when the UI is in light mode and a moon icon for dark.
 */
const ThemeToggle = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}>
      <IconButton onClick={toggleTheme} color="inherit" size="large" aria-label="toggle theme">
        {mode === 'light' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
