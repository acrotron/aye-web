// src/components/Welcome/Welcome.jsx
import React from 'react';
import Layout from './Layout.jsx';
import FeatureCard from './FeatureCard.jsx';
import GifWithCaption from './GifWithCaption.jsx';
import Box from '@mui/material/Box'; // MUI layout container
import './Welcome.css';

function Welcome() {
  return (
    <Layout title="Aye Chat • Real‑time AI‑powered conversations">
      {/* Wrapper that applies the monospaced developer font */}
      <div className="welcome-page">
        {/* Main content – MUI Box layout (row on md+, column on xs) */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'flex-start',
            gap: 4,
            mt: 4,
            mx: 2,
            width: '90%',
          }}
        >
          {/* Left side – tagline text (40% width) */}
          <Box sx={{ flex: '0 0 10%', maxWidth: '10%', minWidth: 0 }}></Box>
          <Box sx={{ flex: '0 0 30%', maxWidth: '30%', minWidth: 0 }}>
            {/* Compact vertical spacing using flex column and small gap */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <h2 className="text-xl font-semibold text-gray-700">{'-{•!•}-'}</h2>
              <h1 className="text-5xl font-semibold text-gray-700">
                <span
                  className="text-5xl font-bold"
                  style={{ marginBottom: '2px', display: 'inline-block' }}
                >
                  Build where it really matters.
                </span>
              </h1>
              <p className="text-base font-medium text-gray-700 tagline">
                Turn your CLI into a collaborative AI workspace.
              </p>
            </Box>
          </Box>
          {/* Right side – demo GIF (60% width) */}
          <Box sx={{ flex: '0 0 60%', maxWidth: '60%' }}>
            <GifWithCaption
              src="/images/main-flow.gif"
              alt="Aye Chat demo"
              caption="Plan. Build. Execute. All from your terminal."
              maxWidth="900px"
              loading="lazy"
            />
          </Box>
        </Box>

        {/* CTA moved above the feature cards */}
        <div className="cta-wrapper">
          <a
            className="cta-link"
            href="https://github.com/acrotron/aye-chat?tab=readme-ov-file#quick-start"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get started here
          </a>
        </div>

        {/* Feature cards – now inside a MUI Box grid (3‑column on md+) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            maxWidth: '1400px',
            mx: 'auto',
            width: '100%',
            px: 4,
            py: 12,
          }}
        >
          <FeatureCard
            title="Instant AI Assistant"
            icon="🤖"
            description="Ask questions, draft code, or generate content."
          />
          <FeatureCard
            title="Safe Code Modification"
            icon="📸"
            description="Saves timestamped snapshots before AI edits."
          />
          <FeatureCard
            title="Intelligent File Detection"
            icon="📄"
            description="Detects relevant source file types automatically."
          />
        </Box>

        {/* Footer notice now part of the scrollable pane */}
        <footer>
          <p className="text-sm">©2025 Acrotron</p>
          <p className="text-xs">Built using Aye Chat</p>
        </footer>
      </div>
    </Layout>
  );
}

export default Welcome;
