// components/ProfileMenu/ProfileMenu.jsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { IoExitOutline, IoCogOutline } from 'react-icons/io5';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

/**
 * ProfileMenu – a fixed‑position avatar + username button that opens a drop‑up
 * menu containing the current user name, a Settings entry and a Log‑out entry.
 * All UI elements are built with Material‑UI components and styled via the
 * theme (`sx` props). No external CSS is required.
 */
export const ProfileMenu = () => {
  // --- UI state -------------------------------------------------------
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // --- Context values -------------------------------------------------
  const { currentUserId, signOut, setShowSettings, setActiveSettingsSection } =
    useChatContext();

  // --- Handlers ------------------------------------------------------
  const handleToggle = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    setActiveSettingsSection('developer');
    setShowSettings(true);
    handleClose();
  };

  const handleLogout = () => {
    signOut();
    handleClose();
  };

  // Close menu on outside click (MUI already handles Escape)
  const menuRef = useRef(null);
  const handleClickOutside = useCallback(
    (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        handleClose();
      }
    },
    [open]
  );
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <Box sx={{ position: 'fixed', left: 16, bottom: 16, zIndex: 1300 }}>
      {/* Avatar + toggle button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          //variant="contained"
          endIcon={open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          onClick={handleToggle}
          //sx={{ textTransform: 'none', minWidth: 120 }}
        >
          <Avatar
            src="/default-avatar-192x192.png"
            alt="User Avatar"
            sx={{ width: 32, height: 32 }}
          />
        </Button>
      </Box>

      {/* Drop‑up menu */}
      <Menu
        ref={menuRef}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // Position the menu above the button (drop‑up)
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{ sx: { mt: 1.5, minWidth: 200, boxShadow: 3 } }}
      >
        {/* Header with username – uses Typography for consistent theming */}
        <Box sx={{ px: 2, py: 1, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle2" noWrap>
            {currentUserId ?? 'Guest'}
          </Typography>
        </Box>
        <Divider />
        {/* Settings menu item */}
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <IoCogOutline size={20} />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>
        {/* Log‑out menu item */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IoExitOutline size={20} />
          </ListItemIcon>
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
