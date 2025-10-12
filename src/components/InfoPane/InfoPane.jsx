// components/InfoPane/InfoPane.jsx
import React from 'react';
import { Box } from '@mui/material';
import { useChatContext } from '../../context/ChatContext';
import InfoHeader from '../InfoHeader/InfoHeader';
import InfoContent from '../InfoContent/InfoContent';

/**
 * Additional‑Info pane – now fully styled with MUI components.
 */
const InfoPane = ({ style }) => {
  const {
    additionalInfoItems,
    removeAdditionalInfo,
    clearAdditionalInfo,
  } = useChatContext();

  return (
    <Box
      className="info-pane"
      sx={{
        height: '100vh',
        flexShrink: 0,
        backgroundColor: 'var(--info-bg)',
        color: '#e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      <InfoHeader onClearAll={clearAdditionalInfo} />
      <InfoContent items={additionalInfoItems} onRemoveItem={removeAdditionalInfo} />
    </Box>
  );
};

export default InfoPane;
