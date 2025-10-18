// src/components/Welcome/Layout.jsx
import React, { useEffect } from 'react';
import Header from './Header.jsx';
import PropTypes from 'prop-types';

function Layout({ title, children }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    // Full‑height flex column – replaces `min‑h‑screen` with `h-screen`
    <div className="antialiased flex flex-col h-screen">
      <Header />
      {/* `flex-1` (or `grow`) makes the main take remaining space; `overflow-y-auto` enables scrolling */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Layout;
