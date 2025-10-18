import React from 'react';
import PropTypes from 'prop-types';
import './GifWithCaption.css';

function GifWithCaption({ src, alt = '', caption = '', maxWidth = '900px', loading = 'lazy' }) {
  const style = { '--max-w': maxWidth };
  return (
    <figure className="gif-figure" style={style}>
      <img src={src} alt={alt} className="demo-gif" loading={loading} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

GifWithCaption.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  caption: PropTypes.string,
  maxWidth: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
};

export default GifWithCaption;
