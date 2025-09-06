import React from 'react';
import './InfoHeader.css';

const InfoHeader = ({ onClearAll }) => {
  return (
    <div className="info-header">
      <h3>Additional Information</h3>
      <div className="info-actions">
        {/* Clear button if desired */}
      </div>
    </div>
  );
};

export default InfoHeader;

