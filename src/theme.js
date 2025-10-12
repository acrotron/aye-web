// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' }, // existing primary
    secondary: { main: '#dc004e' }, // existing secondary
    background: {
      default: '#f5f5f5', // matches app.css background
      paper: '#ffffff',
    },
    text: {
      primary: '#262730', // main text colour used throughout the app
      secondary: '#666666',
    },
    // Custom colour groups – now defined in the theme and referenced via CSS variables
    nav: { main: '#2b2b2b' },               // navigation pane background
    navHeader: { main: '#1e1e1e' },          // navigation header background
    info: { main: '#2b2b2b' },               // info pane background
    infoHeader: { main: '#1e1e1e' },        // info header background
    chat: { main: '#404040' },              // central chat pane background
    resizeHandle: { main: '#fff' },          // resize handle background
    typingIndicator: { main: '#999' },
    // Message bubbles – already used in components
    userMessage: { main: '#d9d9d9' },
    botMessage: { main: '#fbfbfb' },
    // Action colours (used by buttons)
    success: { main: '#28a745' },
    error: { main: '#dc3545' },
    warning: { main: '#f57c00' },
    // Additional UI colours (session list, info items, headers, etc.)
    session: {
      bg: '#fff',
      hover: '#f0f0f0',
      active: '#555',
    },
    infoItem: {
      bg: '#fff',
      headerBg: '#f5f5f5',
      headerBorder: '#e0e0e0',
      titleColor: '#333',
      textColor: '#333',
      linkColor: '#1976d2', // same as primary
      timestampBg: '#f9f9f9',
      timestampBorder: '#e0e0e0',
      timestampColor: '#666666',
    },
    chatHeader: {
      bg: '#f9f9f9',
      border: '#e0e0e0',
      textColor: '#333',
    },
    chatInput: {
      border: '#004000',
      bg: '#ddffdd',
    },
  },
  components: {
    // ------- Buttons -------------------------------------------------------
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none', // keep button text as‑is (no uppercase)
          padding: '0.5rem 1rem',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
    // ------- Form controls ------------------------------------------------
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 6,
        },
        icon: {
          color: '#666666',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          marginBottom: '0.75rem',
        },
      },
    },
    // ------- Accordions (used for SystemPromptEditor) ---------------------
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#fafbfc',
          border: '1px solid #ddd',
          borderRadius: 8,
          '&:before': { display: 'none' }, // remove default divider line
        },
      },
    },
    // ------- Cards / Papers (info cards, message bubbles) -----------------
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    // ------- Drawer (settings drawer) ------------------------------------
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          width: '80vw',
          maxWidth: '80vw',
        },
      },
    },
    // ------- List items (navigation pane, session list) -------------------
    MuiListItemButton: {
      styleOverrides: {
        root: {
          // Darker hover background for better contrast on the dark nav pane
          '&:hover': {
            backgroundColor: '#444', // slightly lighter than selected but still dark
          },
          // Darker selected background and forced white text for readability
          '&.Mui-selected': {
            backgroundColor: '#555',
            color: '#fff',
            // Ensure the primary text inside the ListItem also becomes white
            '& .MuiListItemText-primary': {
              color: '#fff',
            },
          },
        },
      },
    },
    // ------- Tooltip (optional, for copy buttons, etc.) ------------------
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '0.85rem',
        },
      },
    },
  },
});
