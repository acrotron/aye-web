// components/ModelSelector/ModelSelector.jsx
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * Model selector using MUI components.
 * Props:
 *   - selectedModel: currently selected model id
 *   - onModelChange: callback receiving the new model id
 *   - availableModels: array of { id, name } objects
 */
const ModelSelector = ({ selectedModel, onModelChange, availableModels }) => {
  const handleChange = (event) => {
    onModelChange(event.target.value);
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="model-select-label">Model</InputLabel>
      <Select
        labelId="model-select-label"
        id="model-select"
        value={selectedModel}
        label="Model"
        onChange={handleChange}
      >
        {availableModels.map((model) => (
          <MenuItem key={model.id} value={model.id}>
            {model.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ModelSelector;
