import { useState, useCallback } from 'react';

export const useAdditionalInfo = () => {
  const [additionalInfoItems, setAdditionalInfoItems] = useState([]);

  const addAdditionalInfo = useCallback((type, title, content) => {
    const info = {
      type,
      title,
      content,
      timestamp: new Date(),
    };
    setAdditionalInfoItems((prev) => {
      const next = [info, ...prev];
      return next.slice(0, 10); // keep max 10
    });
  }, []);

  const removeAdditionalInfo = useCallback((idx) => {
    setAdditionalInfoItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearAdditionalInfo = useCallback(() => {
    setAdditionalInfoItems([]);
  }, []);

  const extractAdditionalInfo = useCallback((botMessage) => {
    console.log('in extractAdditionalInfo');
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    while ((match = codeBlockRegex.exec(botMessage)) !== null) {
      const language = match[1] || 'text';
      const code = match[2];
      addAdditionalInfo('code', `Code (${language})`, code);
    }

    //const urlRegex = /(https?:\/\/[^\s]+)/g;
    //const urls = botMessage.match(urlRegex);
    //if (urls) {
    //  urls.forEach((url) => addAdditionalInfo('source', 'Reference', url));
    //}

    return botMessage.trim();
  }, [addAdditionalInfo]);

  return {
    additionalInfoItems,
    addAdditionalInfo,
    removeAdditionalInfo,
    clearAdditionalInfo,
    extractAdditionalInfo,
  };
};

