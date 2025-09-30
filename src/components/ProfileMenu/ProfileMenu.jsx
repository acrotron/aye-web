// Ion Icons set: https://ionic.io/ionicons
// installed with: npm install react-icons
import { IoExitOutline, IoCogOutline } from "react-icons/io5";
import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatContext } from '../../context/ChatContext';
// import { useNavigate } from 'react-router-dom';  // Removed navigation import
import './ProfileMenu.css';


export const ProfileMenu = () => {
  //  ── UI state ───────────────────────────────────────
  const [expanded, setExpanded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  //  ── Data coming from your ChatProvider (or any auth source) ──
  const { currentUserId, user, signOut, setShowSettings, setActiveSettingsSection } = useChatContext();
  // const navigate = useNavigate();  // Removed navigation hook

  //  ── Helpers ───────────────────────────────────────
  const toggle = () => setExpanded((prev) => !prev);
  const handleLogout = () => {
    signOut();          // Amplify will clear the session and show the login UI again
    setExpanded(false); // collapse the menu
  };

  // ---------- CLOSE‑ON‑CLICK‑OUTSIDE ----------NOT WORKING
  const handleClickOutside = useCallback(
    (event) => {
      // If the menu is collapsed, ignore.
      if (!expanded) return;

      // `wrapperRef.current` is the div that encloses the button + panel.
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setExpanded(false);
        // toggleBtnRef.current?.focus();  // Commented out unused reference
      }
    },
    [expanded]
  );

  // ---------- CLOSE‑ON‑ESC ----------
  const handleEsc = useCallback(
    (event) => {
      if (expanded && event.key === 'Escape') {
        setExpanded(false);
        // toggleBtnRef.current?.focus();  // Commented out unused reference
      }
    },
    [expanded]
  );

  // Register listeners when the component mounts, and clean up on unmount.
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [handleClickOutside, handleEsc]);

  //  ── Render ───────────────────────────────────────
return (
  <div className="profile-menu">
    {/* ---------- Red rectangle that holds logo and toggle button ---------- */}
    <div className="profile-header-box">
      <div className="profile-header">
        {/* Logo */}
        <img
          src="/logo-192x192.png"
          alt="App logo"
          className="profile-logo"
          width={32}
          height={32}
        />

        {/* Toggle button */}
        <button
          type="button"
          className="profile-toggle"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label="User menu"
        >
          {currentUserId ?? 'Guest'}
          <span className={`arrow ${expanded ? 'up' : 'down'}`} />
        </button>
      </div>
    </div>

    {/* ---------- Drop‑up panel (only when expanded) ---------- */}
    {expanded && (
      <div className="profile-panel">
        <div className="profile-username">{currentUserId ?? 'Guest'}</div>

        {/* Settings button - now opens slideout drawer */}
        <button 
          className="profile-item-btn" 
          onClick={() => {
            setActiveSettingsSection('developer');
            setShowSettings(true);
            setExpanded(false);
          }}
        >
          <IoCogOutline className="profile-item-icon" aria-hidden="true" />
          <span className="profile-item-text">Settings</span>
        </button>
        {/* Logout button with the exit‑outline icon */}
        <button className="profile-item-btn" onClick={signOut}>
          <IoExitOutline className="profile-item-icon" aria-hidden="true" />
          <span className="profile-item-text">Log out</span>
        </button>
      </div>
    )}
  </div>
);
};