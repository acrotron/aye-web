import React, { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import { truncateText } from '../utils/helpers';

/**
 * Hook that manages the message list for the current chat session.
 *
 * @param {object}   chatSessions          – result of `useChatSessions`
 * @param {object}   chatService           – your service that talks to the LLM / API
 * @param {string}   currentUserId         – the signed‑in user id
 * @param {object}   additionalInfo        – the object returned by `useAdditionalInfo`
 *                                            (contains `extractAdditionalInfo`)
 * @param {string}   selectedModel         – the currently selected model
 * @param {string}   systemPrompt          – the current system prompt
 *
 * @returns {object} { messages, conversationHistory, …, sendMessage }
 */
export const useMessages = (
  chatSessions,
  chatService,
  currentUserId,
  additionalInfo,
  selectedModel,
  systemPrompt
) => {
  // -----------------------------------------------------------------
  // Local UI state
  // -----------------------------------------------------------------
  const [messages, setMessages] = useState([]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // -----------------------------------------------------------------
  // Pull the needed helpers out of the chat‑session object
  // -----------------------------------------------------------------
  const {
    currentSessionId,
    getCurrentSession,
    loadSpecificChatSession,
    updateSessionFromBackendResponse,
    setChatSessions,
    /** NEW – optimistic reorder helper */
    touchSession,
  } = chatSessions;

  // -----------------------------------------------------------------
  // Pull the extractor supplied by `useAdditionalInfo`
  // -----------------------------------------------------------------
  const { extractAdditionalInfo } = additionalInfo;

  // -----------------------------------------------------------------
  // Load / hydrate messages when the **selected** session changes.
  // -----------------------------------------------------------------
  const prevSessionIdRef = React.useRef();   // remember the previous id

  useEffect(() => {
    if (currentSessionId === null) return;

    const session = getCurrentSession();
    if (!session) return;

    // -------------------------------------------------------------
    // 1️⃣ If the session isn’t loaded yet (and it isn’t the temporary
    //    “‑1” placeholder) ask the backend to fetch it.
    // -------------------------------------------------------------
    if (!session.isLoaded && currentSessionId !== -1) {
      loadSpecificChatSession(currentSessionId);
      return;
    }

    // -------------------------------------------------------------
    // 2️⃣ Determine *why* the id changed.
    //    • If we just moved **from the temporary “‑1” chat** to the real
    //      ID that the backend returned, we **must keep the messages that
    //      are already on screen** (the user message + the assistant reply).
    //    • Otherwise (switching to a completely different stored chat,
    //      or the very first selection after creating a new chat) we
    //      replace the UI with the stored session data.
    // -------------------------------------------------------------
    const wasTempToReal = prevSessionIdRef.current === -1 && currentSessionId !== -1;
    const isSwitchingSession = prevSessionIdRef.current !== currentSessionId;

    if (isSwitchingSession) {
      if (wasTempToReal) {
        // ---------------------------------------------------------
        //   TEMP → REAL (first response of a brand‑new chat)
        //   Keep whatever is already rendered – it already contains
        //   the user message and the assistant reply.
        // ---------------------------------------------------------
        // No state change needed; just fall through.
      } else {
        // ---------------------------------------------------------
        //   Normal navigation to another existing chat (or the initial
        //   selection of a freshly created chat).
        //   Load that chat’s persisted messages.
        // ---------------------------------------------------------
        setMessages(session.messages ?? []);
        setConversationHistory(session.conversationHistory ?? []);
      }
    } else {
      // -------------------------------------------------------------
      //   We are still on the same session (e.g. after the first bot
      //   reply while the id is the real one).  Initialise only if the
      //   UI is completely empty.
      // -------------------------------------------------------------
      setMessages((prev) => {
        if (prev && prev.length > 0) return prev;
        return session.messages ?? [];
      });
      setConversationHistory((prev) => {
        if (prev && prev.length > 0) return prev;
        return session.conversationHistory ?? [];
      });
    }

    // Remember the id for the next run.
    prevSessionIdRef.current = currentSessionId;
  }, [
    currentSessionId,
    getCurrentSession,
    loadSpecificChatSession,
    // We deliberately DO NOT depend on `messages` or `conversationHistory`
    // – this effect should run **only** when the *selected* session id changes.
  ]);

  // -----------------------------------------------------------------
  // Helper – persist the local message list back into the session store
  // -----------------------------------------------------------------
  const saveCurrentSessionState = useCallback(
    (updatedMessages, updatedHistory) => {
      const messagesToSave = updatedMessages || messages;
      const historyToSave = updatedHistory || conversationHistory;

      setChatSessions((prev) =>
        prev.map((s) => {
          if (s.id !== currentSessionId) return s;

          // Auto‑rename the chat after the user sends a second message
          const maybeNewName =
            (s.name === 'New Chat' ||
              s.name.startsWith('Chat ')) &&
            messagesToSave.length > 1
              ? truncateText(
                  messagesToSave.find((m) => m.sender === 'user')?.text ||
                    '',
                  30
                )
              : s.name;

          return {
            ...s,
            messages: [...messagesToSave],
            conversationHistory: [...historyToSave],
            name: maybeNewName,
            lastUpdated: new Date(),
          };
        })
      );
    },
    [currentSessionId, messages, conversationHistory, setChatSessions]
  );

  // -----------------------------------------------------------------
  // Add a single message (user or bot) to the UI list
  // -----------------------------------------------------------------
  const addMessage = useCallback(
    (txt, sender) => {
      const newMsg = { text: txt, sender, timestamp: new Date() };

      setMessages((prev) => {
        const updatedMessages = [...prev, newMsg];
        // Persist the new list *after* state has been queued
        setTimeout(
          () => saveCurrentSessionState(updatedMessages, conversationHistory),
          0
        );
        return updatedMessages;
      });
    },
    [saveCurrentSessionState, conversationHistory]
  );

  // -----------------------------------------------------------------
  // SEND MESSAGE – the core routine called by the chat input
  // -----------------------------------------------------------------
  const sendMessage = useCallback(
    async (msgText) => {
      // -----------------------------------------------------------------
      // 1️⃣ Normalise the user's input
      // -----------------------------------------------------------------
      const txt = (msgText ?? currentMessage).trim();
      if (!txt) return;

      // -------------------------------------------------------------
      // 2️⃣ Show the user message immediately (markdown‑rendered)
      // -------------------------------------------------------------
      const formatted = marked.parse(txt);
      addMessage(formatted, 'user');

      // -------------------------------------------------------------
      // 3️⃣ Update the local conversation history (the raw, un‑markdown text)
      // -------------------------------------------------------------
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: txt },
      ];
      setConversationHistory(updatedHistory);

      // -------------------------------------------------------------
      // 4️⃣ Prepare UI for the LLM response
      // -------------------------------------------------------------
      setCurrentMessage('');
      setIsTyping(true);

      try {
        // ---------------------------------------------------------
        // 5️⃣ Call the backend / LLM service with the selected model and system prompt
        // ---------------------------------------------------------
        const chatId = currentSessionId ?? -1;
        const response = await chatService.sendMessage(
          currentUserId,
          chatId,
          txt,
          selectedModel, // Pass the selected model to the service
          systemPrompt   // Pass the system prompt to the service
        );

        // ---------------------------------------------------------
        // 6️⃣ Let the backend update any session‑level fields
        // ---------------------------------------------------------
        updateSessionFromBackendResponse(response);

        // ---------------------------------------------------------
        // **NEW – optimistic reorder**
        // ---------------------------------------------------------
        // We now know the backend accepted the message, so we immediately
        // bump the session's `lastUpdated` timestamp.  This moves the
        // active session to the top of the NavPane without a full reload.
        if (typeof touchSession === 'function') {
          touchSession(currentSessionId);
        }

        // ---------------------------------------------------------
        // 7️⃣ Extract additional info (code, URLs, …)
        // ---------------------------------------------------------
        const cleanedBotMessage = extractAdditionalInfo(
          response.assistant_response
        );

        // ---------------------------------------------------------
        // 8️⃣ Append the assistant turn to the history (raw text)
        // ---------------------------------------------------------
        const finalHistory = [
          ...updatedHistory,
          { role: 'assistant', content: response.assistant_response },
        ];
        setConversationHistory(finalHistory);

        // ---------------------------------------------------------
        // 9️⃣ Show the *cleaned* assistant reply in the chat UI
        // ---------------------------------------------------------
        addMessage(cleanedBotMessage, 'bot');
      } catch (error) {
        console.error('Message send error:', error);
        addMessage(
          '⚠️ Sorry, I encountered an error. Please try again.',
          'bot'
        );
      } finally {
        setIsTyping(false);
      }
    },
    // -----------------------------------------------------------------
    // Dependencies – everything used inside the callback must be listed
    // -----------------------------------------------------------------
    [
      currentMessage,
      conversationHistory,
      addMessage,
      currentSessionId,
      chatService,
      currentUserId,
      updateSessionFromBackendResponse,
      extractAdditionalInfo,
      /** NEW – include the helper in the memoisation list */
      touchSession,
      selectedModel, // Include selectedModel in dependencies
      systemPrompt,  // Include systemPrompt in dependencies
    ]
  );

  // -----------------------------------------------------------------
  // Public API of the hook
  // -----------------------------------------------------------------
  return {
    messages,
    conversationHistory,
    currentMessage,
    setCurrentMessage,
    isTyping,
    addMessage,
    sendMessage,
  };
};

