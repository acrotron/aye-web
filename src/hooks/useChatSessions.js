import { useState, useEffect, useCallback } from "react";

export const useChatSessions = (chatService, currentUserId, systemPrompt) => {
  // -----------------------------------------------------------------
  // Core state
  // -----------------------------------------------------------------
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  // -----------------------------------------------------------------
  // NEW – hook consumer can pass an optional callback that opens the
  //      settings drawer on the "Developer" tab.
  // -----------------------------------------------------------------
  const [openSettingsOnNoToken, setOpenSettingsOnNoToken] = useState(null);
  
  // Store the API response data to check later when callback is set
  const [apiResponseData, setApiResponseData] = useState(null);

  // -----------------------------------------------------------------
  // Load **all** sessions from the backend (runs once on mount)
  // -----------------------------------------------------------------
  const loadChatSessionsFromBackend = useCallback(async () => {
    try {
      // NEW – API now returns { has_token: boolean, chat_sessions: [...] }
      const data = await chatService.loadAllSessions(currentUserId);
      const rawSessions = data.chat_sessions ?? data; // fallback for legacy list
      
      // Store the API response for later use
      setApiResponseData(data);
      
      // Transform rows → UI shape
      const sessions = rawSessions.map((s) => ({
        id: s.chat_id,
        name: s.chat_title,
        messages: [],
        conversationHistory: [{ role: "system", content: systemPrompt }],
        createdAt: s.created_at,
        lastUpdated: s.updated_at,
        isLoaded: false,
        // Preserve any system prompt / model that may already be present
        // (mostly relevant when we later load individual sessions)
      }));
      
      // Order newest first (most recent `lastUpdated` first)
      sessions.sort((a, b) => {
        const aMs = new Date(a.lastUpdated).getTime();
        const bMs = new Date(b.lastUpdated).getTime();
        return bMs - aMs;
      });
      
      if (sessions.length > 0) {
        setChatSessions(sessions);
        setCurrentSessionId(sessions[0].id); // newest becomes active
      } else {
        // No saved sessions → create a fresh "New Chat"
        createNewChat(); // this also setsCurrentSessionId(-1)
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
      // Gracefully fall back to a brand‑new chat if the request fails.
      createNewChat();
    }
  }, [chatService, currentUserId, systemPrompt]);

  // -----------------------------------------------------------------
  // NEW – Effect to handle opening settings when callback is set
  // -----------------------------------------------------------------
  useEffect(() => {
    // Check if we have both the callback and the API data
    if (openSettingsOnNoToken && apiResponseData && apiResponseData.has_token === false) {
      // Open the settings drawer
      openSettingsOnNoToken(apiResponseData);
      // Clear the data so we don't re-trigger
      setApiResponseData(null);
    }
  }, [openSettingsOnNoToken, apiResponseData]);

  // -----------------------------------------------------------------
  // CREATE a brand‑new empty chat (used when no rows exist or on error)
  // -----------------------------------------------------------------
  const createNewChat = useCallback(() => {
    const welcomeMessage = {
      text:
        "Hello! I'm Régine, your trusted AI Assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    };

    const newSession = {
      id: -1,
      name: "New Chat",
      messages: [welcomeMessage],
      conversationHistory: [{ role: "system", content: systemPrompt }],
      createdAt: new Date(),
      lastUpdated: new Date(),
      isLoaded: true,
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(-1);
  }, [systemPrompt]);

  // -----------------------------------------------------------------
  // Load a **specific** session (when the user clicks a row)
  // -----------------------------------------------------------------
  const loadSpecificChatSession = useCallback(
    async (chatId) => {
      try {
        const backend = await chatService.loadSession(currentUserId, chatId);

        const msgs = [];
        const hist = backend.chat_text || [];

        hist.forEach((msg) => {
          if (msg.role === "user" || msg.role === "assistant") {
            msgs.push({
              text: msg.content,
              sender: msg.role === "user" ? "user" : "bot",
              timestamp: new Date(),
            });
          }
        });

        // -------------------------------------------------------------
        // NEW – pull the extra fields that the API now returns
        // -------------------------------------------------------------
        const returnedSystemPrompt = backend.system_prompt ?? null;
        const returnedModel        = backend.model ?? null;

        const updatedSession = {
          id: chatId,
          name: backend.chat_title,
          messages: msgs,
          conversationHistory:
            hist.length > 0
              ? hist
              : [{ role: "system", content: systemPrompt }],
          createdAt: new Date(),
          lastUpdated: new Date(),
          isLoaded: true,
          // Store the extra fields on the session object.
          systemPrompt: returnedSystemPrompt,
          model: returnedModel,
        };

        setChatSessions((prev) =>
          prev.map((s) => (s.id === chatId ? { ...s, ...updatedSession } : s))
        );

        return updatedSession;
      } catch (error) {
        console.error("Failed to load session", chatId, error);
        throw error;
      }
    },
    [chatService, currentUserId, systemPrompt]
  );

  // -----------------------------------------------------------------
  // Delete a session
  // -----------------------------------------------------------------
  const deleteSession = useCallback(
    (sessionId, ev) => {
      if (ev) ev.stopPropagation();

      setChatSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== sessionId);

        // If we just removed the active one, pick the next available
        if (currentSessionId === sessionId) {
          if (filtered.length > 0) {
            setCurrentSessionId(filtered[0].id);
          }
          else {
            // Nothing left – create a fresh empty chat
            createNewChat();
          }
        }
        return filtered;
      });
    },
    [currentSessionId, createNewChat]
  );

  // -----------------------------------------------------------------
  // Update a session after the backend replies to a user message
  // -----------------------------------------------------------------
  const updateSessionFromBackendResponse = useCallback(
    (resp) => {
      setChatSessions((prev) =>
        prev.map((s) => {
          if (s.id === currentSessionId || (s.id === -1 && currentSessionId === -1)) {
            const updated = { ...s };

            // Replace the temporary "New Chat" (-1) with the real ids.
            if (s.id === -1) {
              updated.id = resp.chat_id;
              updated.name = resp.chat_title;
              updated.isLoaded = true;
            }

            if (updated.name !== resp.chat_title) {
              updated.name = resp.chat_title;
            }

            // ---------------------------------------------------------
            // NEW – If the backend sends back a system_prompt or model,
            // update the session object as well.
            // ---------------------------------------------------------
            if (resp.system_prompt) {
              updated.systemPrompt = resp.system_prompt;
            }
            if (resp.model) {
              updated.model = resp.model;
            }

            updated.lastUpdated = new Date();
            return updated;
          }
          return s;
        })
      );

      // If we just turned the placeholder into a real chat, switch the id.
      if (currentSessionId === -1) {
        setCurrentSessionId(resp.chat_id);
      }
    },
    [currentSessionId]
  );

  // -----------------------------------------------------------------
  // Optimistic "touch" – bump a session's `lastUpdated` and re‑sort
  // -----------------------------------------------------------------
  const touchSession = useCallback((sessionId) => {
    const nowIso = new Date().toISOString();

    setChatSessions((prev) => {
      const bumped = prev.map((s) =>
        s.id === sessionId ? { ...s, lastUpdated: nowIso } : s
      );

      // Re‑sort newest‑first (same comparator used during load)
      bumped.sort((a, b) => {
        const aMs = new Date(a.lastUpdated).getTime();
        const bMs = new Date(b.lastUpdated).getTime();
        return bMs - aMs;
      });

      return bumped;
    });
  }, []); // no external deps

  // -----------------------------------------------------------------
  // Initialise – run once when the component mounts
  // -----------------------------------------------------------------
  useEffect(() => {
    loadChatSessionsFromBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps – we want this to run only on mount

  // -----------------------------------------------------------------
  // Helper – return the currently‑selected session object (or null)
  // -----------------------------------------------------------------
  const getCurrentSession = useCallback(() => {
    return chatSessions.find((s) => s.id === currentSessionId) || null;
  }, [chatSessions, currentSessionId]);

  // -----------------------------------------------------------------
  // Return everything the rest of the app needs
  // -----------------------------------------------------------------
  return {
    chatSessions,
    currentSessionId,
    setCurrentSessionId,
    getCurrentSession,
    createNewChat,
    deleteSession,
    loadSpecificChatSession,
    updateSessionFromBackendResponse,
    setChatSessions,
    /** Optimistic UI helper */
    touchSession,
    /** NEW – let parent pass the drawer opener callback */
    setOpenSettingsOnNoToken,
  };
};

