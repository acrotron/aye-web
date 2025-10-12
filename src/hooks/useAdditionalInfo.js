// hooks/useAdditionalInfo.js
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
      // keep only the newest 10 items
      return next.slice(0, 10);
    });
  }, []);

  const removeAdditionalInfo = useCallback((idx) => {
    setAdditionalInfoItems((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearAdditionalInfo = useCallback(() => {
    setAdditionalInfoItems([]);
  }, []);

  // -----------------------------------------------------------------
  // Extract additional information (code blocks, URLs, …) from the bot
  // message. The previous regex only matched language identifiers made of
  // "word" characters (\w), which excluded common identifiers like
  // "c++", "js", "python-3" etc. The new regex captures any characters
  // up to the first newline **or** works when the code block has no
  // language identifier at all.
  // -----------------------------------------------------------------
  const extractAdditionalInfo = useCallback(
    (botMessage) => {
      console.log('🔎 extracting additional info'); // optional debug
      // Matches:
      //   ```optionalLanguage\ncode...```   (language may be empty)
      //   ```\ncode...```                (no language, but a newline)
      //   ```code```                       (single‑line code block, no newline)
      const codeBlockRegex = /```(?:([^`\n]*)\n)?([\s\S]*?)```/g;
      let match;
      while ((match = codeBlockRegex.exec(botMessage)) !== null) {
        const language = (match[1] || '').trim() || 'text';
        const code = match[2];
        addAdditionalInfo('code', `Code (${language})`, code);
      }

      // Future: URL extraction can be added here.

      // Return the original message (still contains the code block –
      // the UI renders it as markdown). If you prefer to strip the block
      // from the displayed text, uncomment the line below.
      // return botMessage.replace(codeBlockRegex, '').trim();
      return botMessage.trim();
    },
    [addAdditionalInfo]
  );

  return {
    additionalInfoItems,
    addAdditionalInfo,
    removeAdditionalInfo,
    clearAdditionalInfo,
    extractAdditionalInfo,
  };
};
