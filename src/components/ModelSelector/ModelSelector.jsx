// components/ModelSelector/ModelSelector.jsx
import React from 'react';
import './ModelSelector.css';

const ModelSelector = ({ selectedModel, onModelChange, availableModels }) => {
  const handleChange = (event) => {
    onModelChange(event.target.value);
  };

  return (
    <div className="model-selector-container">
      <label htmlFor="model-select" className="model-selector-label">
        Model:
      </label>
      <select
        id="model-select"
        className="model-selector"
        value={selectedModel}
        onChange={handleChange}
      >
        {availableModels.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;

