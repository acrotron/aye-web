// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Provides the current colour mode ('light' | 'dark') and a toggle function.
 * It also adds / removes the `.light-theme` CSS class on <body> so that
 * the CSS variable definitions in `app.css` switch accordingly.
 */
export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('dark'); // default to dark

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keep the body class in sync with the mode
  useEffect(() => {
    if (mode === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return ctx;
};
