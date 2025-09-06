import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import InfoHeader from '../InfoHeader/InfoHeader';
import InfoContent from '../InfoContent/InfoContent';
import './InfoPane.css';

const InfoPane = ({ style }) => {
  const { 
    additionalInfoItems, 
    removeAdditionalInfo, 
    clearAdditionalInfo 
  } = useChatContext();

  return (
    <div className="info-pane" style={style}>
      <InfoHeader onClearAll={clearAdditionalInfo} />
      <InfoContent 
        items={additionalInfoItems}
        onRemoveItem={removeAdditionalInfo}
      />
    </div>
  );
};

export default InfoPane;

