import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * SessionList – renders the first session always visible and a collapsible list
 * for the next few sessions (up to `maxHidden`). All items are styled with MUI.
 */
const SessionList = ({
  sessions,
  currentSessionId,
  setCurrentSessionId,
  deleteSession,
  maxHidden = 100, // maximum number of sessions shown inside the expander
  openSettings, // callback to open Model/System Prompt settings
}) => {
  const [open, setOpen] = useState(false);

  // Always show the first session (if any)
  const first = sessions.slice(0, 1);
  // Show the next `maxHidden` sessions inside the collapsible area
  const hidden = sessions.slice(1, 1 + maxHidden);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <List component="nav" disablePadding>
      {/* First (always visible) session */}
      {first.map((session) => (
        <ListItemButton
          key={session.id}
          selected={session.id === currentSessionId}
          onClick={() => setCurrentSessionId(session.id)}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <ListItemText primary={session.name} />
          <IconButton
            edge="end"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              deleteSession(session.id, e);
            }}
            aria-label="delete session"
          >
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </ListItemButton>
      ))}

      {/* Link‑styled button for Model & System Prompt – appears after the first session */}
      {first.length > 0 && (
        <ListItemButton
          onClick={openSettings}
          sx={{
            justifyContent: 'flex-start',
            paddingY: 0.5,
            // Link appearance
            '& .MuiListItemText-primary': {
              color: '#007bff',
              textDecoration: 'underline',
            },
          }}
        >
          <ListItemText primary="    Model & System Prompt" />
        </ListItemButton>
      )}

      {/* Expander for additional sessions */}
      {hidden.length > 0 && (
        <>
          <ListItemButton onClick={toggle} sx={{ justifyContent: 'space-between' }}>
            <ListItemText primary={open ? '▲ Show less' : `▼ ${hidden.length} more`} />
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            {/* Scrollable container for hidden sessions */}
            <List
              component="div"
              disablePadding
              sx={{ maxHeight: 250, overflowY: 'auto' }}
            >
              {hidden.map((session) => (
                <ListItemButton
                  key={session.id}
                  selected={session.id === currentSessionId}
                  onClick={() => setCurrentSessionId(session.id)}
                  sx={{
                    pl: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText primary={session.name} />
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id, e);
                    }}
                    aria-label="delete session"
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </>
      )}
    </List>
  );
};

export default SessionList;
