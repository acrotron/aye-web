import React from 'react';
import './ResizeHandle.css';

const ResizeHandle = ({ isResizing, onResizeStart }) => {
  return (
    <div
      className={`resize-handle ${isResizing ? 'resizing' : ''}`}
      onMouseDown={onResizeStart}
      title="Drag to resize panes"
    >
      <div className="resize-indicator"></div>
    </div>
  );
};

export default ResizeHandle;

