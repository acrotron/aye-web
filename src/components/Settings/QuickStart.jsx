import React from 'react';
import './QuickStart.css';

function QuickStart() {
  return (
    <section className="quick-start-section">
      <h3 className="text-2xl font-semibold text-gray-300 mb-8">Quick Start</h3>
      <ol className="step-list">
        <li>
          <span className="step-title">Install the tool</span>
          <pre><code>pip install ayechat</code></pre>
        </li>
        <li>
          <span className="step-title">Authenticate</span>
          <pre><code>aye auth login</code></pre>
          <p className="step-note">Paste your personal access token when prompted.</p>
        </li>
        <li>
          <span className="step-title">Start Interactive Chat</span>
          <pre><code>aye chat</code></pre>
        </li>
      </ol>
    </section>
  );
}

export default QuickStart;
