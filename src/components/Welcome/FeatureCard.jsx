import React from 'react';
import PropTypes from 'prop-types';
import './FeatureCard.css';

function FeatureCard({ title, description, icon = '✨' }) {
  return (
    <div className="card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

export default FeatureCard;
