// src/components/Welcome/Header.jsx
import React from 'react';
import './Header.css';

const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/acrotron/aye-chat' },
  { label: 'Docs', href: 'https://github.com/acrotron/aye-chat#readme' },
  { label: 'Join', href: '/' },
];

function Header() {
  return (
    <nav className="welcome-header">
      <a href="/" className="logo-wrapper">
        {/* Reduced logo height – new class `logo-img` */}
        <img src="/images/aye-chat-logo-full-cropped.png" alt="Aye Chat logo" className="logo-img" />
      </a>
      <ul className="external-links">
        {externalLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="link">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Header;
