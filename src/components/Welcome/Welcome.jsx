import React from 'react';
import Layout from './Layout.jsx';
import FeatureCard from './FeatureCard.jsx';
import GifWithCaption from './GifWithCaption.jsx';

import './Welcome.css';

function Welcome() {
  return (
    <Layout title="Aye Chat • Real‑time AI‑powered conversations">
      {/* Wrapper that applies the monospaced developer font */}
      <div className="welcome-page">
        <section className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center md:items-center justify-center gap-8 md:gap-12 py-8 px-4">
          <div className="flex flex-col items-center text-center w-full md:w-1/3 md:order-1 mx-auto mt-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{'-{•!•}-'}</h2>
            <p className="text-base font-medium text-gray-700 tagline">
              <span className="text-5xl font-bold" style={{ marginBottom: '35px', display: 'inline-block' }}>
                Build where it really matters.
              </span>
              Turn your CLI into a collaborative AI workspace.
            </p>
          </div>
          <div className="w-full md:w-2/3 md:order-2 mx-auto">
            <GifWithCaption
              src="/images/main-flow.gif"
              alt="Aye Chat demo"
              caption="Plan. Build. Execute. All from your terminal."
              maxWidth="900px"
              loading="lazy"
            />
          </div>
        </section>

        {/* CTA moved above the feature cards */}
        <div className="cta-wrapper">
          <a className="cta-link" href="https://github.com/acrotron/aye-chat?tab=readme-ov-file#quick-start" target="_blank" rel="noopener noreferrer">
            Get started here
          </a>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-4 py-12">
          <FeatureCard title="Instant AI Assistant" icon="🤖" description="Ask questions, draft code, or generate content." />
          <FeatureCard title="Safe Code Modification" icon="📸" description="Saves timestamped snapshots before AI edits." />
          <FeatureCard title="Intelligent File Detection" icon="📄" description="Detects relevant source file types automatically." />
        </section>

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
