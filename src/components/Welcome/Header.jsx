import React from 'react';

const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/acrotron/aye-chat' },
  { label: 'Docs', href: 'https://github.com/acrotron/aye-chat#readme' },
  { label: 'Join', href: '/' },
];

function Header() {
  return (
    <nav className="sticky-header">
      <a href="/" className="logo-wrapper">
        <img src="/images/aye-chat-logo-full-cropped.png" alt="Aye‑Chat logo" className="h-18 w-auto" />
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
