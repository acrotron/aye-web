import React from 'react';
import './InfoContent.css';

const InfoContent = ({ items, onRemoveItem }) => {
  if (items.length === 0) {
    return (
      <div className="info-content">
        <div className="empty-info">
          <p>
            Code snippets, sources, and additional information will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="info-content">
      {items.map((item, i) => (
        <div key={i} className="info-item">
          <div className="info-item-header">
            <div className={`info-type-icon type-${item.type}`}>
              {item.type === 'code' && <span>{'</>'}</span>}
              {item.type === 'source' && <span>🔗</span>}
              {item.type === 'note' && <span>📝</span>}
              {item.type === 'image' && <span>🖼</span>}
            </div>
            <div className="info-title">{item.title}</div>
            <button
              className="remove-info-btn"
              onClick={() => onRemoveItem(i)}
              title="Remove"
            >
              ×
            </button>
          </div>

          <div className="info-content-text">
            {item.type === 'code' && (
              <pre>
                <code>{item.content}</code>
              </pre>
            )}
            {item.type === 'source' && (
              <a
                href={item.content}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.content}
              </a>
            )}
            {item.type === 'note' && <p>{item.content}</p>}
            {item.type === 'image' && (
              <img src={item.content} alt="Additional image" />
            )}
          </div>

          <div className="info-timestamp">
            {item.timestamp.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoContent;

