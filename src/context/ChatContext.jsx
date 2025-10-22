import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { useChatSessions } from "../hooks/useChatSessions";
import { useMessages } from "../hooks/useMessages";
import { useAdditionalInfo } from "../hooks/useAdditionalInfo";
import { DEFAULT_MODEL } from "../config/models";

const ChatContext = createContext();

export const ChatProvider = ({
  children,
  user,
  signOut,
  chatService,
}) => {
  const currentUserId = user?.signInDetails?.loginId || "Guest";

  // -----------------------------------------------------------------
  // Default system prompt (the one you want every *new* chat to start with)
  // -----------------------------------------------------------------
  const defaultSystemPrompt = `You are a helpful assistant named Régine that provides clear and concise answers.

Answer **directly**, give only the information the user asked for. When you are unsure, say so. You generate your responses in markdown format but not excessively: only when in need to do bulleted lists or separate sections if asked.

You follow instructions closely and respond accurately to a given prompt. You emphasize precise instruction‑following and accuracy over speed of response: take your time to understand a question.  Focus on accuracy in your response and follow the instructions precisely. At the same time, keep your answers brief and concise unless asked otherwise.

Keep the tone professional and neutral and to the point.`;

  // -----------------------------------------------------------------
  // UI state that lives in the context
  // -----------------------------------------------------------------
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [systemPrompt, setSystemPrompt]   = useState(defaultSystemPrompt);
  const [showSettings, setShowSettings]   = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState('model');

  // -----------------------------------------------------------------
  // Core chat data (sessions, messages, etc.)
  // -----------------------------------------------------------------
  const chatSessions = useChatSessions(
    chatService,
    currentUserId,
    systemPrompt
  );
  const additionalInfo = useAdditionalInfo();
  const messages = useMessages(
    chatSessions,
    chatService,
    currentUserId,
    additionalInfo,
    selectedModel,
    systemPrompt
  );

  // -----------------------------------------------------------------
  // 1️⃣ When the user edits the prompt we also write it to the
  //    *currently selected* session object (so the sync‑effect cannot
  //    overwrite it later).
  // -----------------------------------------------------------------
  const setSystemPromptAndSession = (newPrompt) => {
    setSystemPrompt(newPrompt);
    if (chatSessions.currentSessionId != null) {
      chatSessions.setChatSessions((prev) =>
        prev.map((s) =>
          s.id === chatSessions.currentSessionId
            ? { ...s, systemPrompt: newPrompt }
            : s
        )
      );
    }
  };

  // -----------------------------------------------------------------
  // 2️⃣ Same idea for the model selector.
  // -----------------------------------------------------------------
  const setSelectedModelAndSession = (newModel) => {
    setSelectedModel(newModel);
    if (chatSessions.currentSessionId != null) {
      chatSessions.setChatSessions((prev) =>
        prev.map((s) =>
          s.id === chatSessions.currentSessionId
            ? { ...s, model: newModel }
            : s
        )
      );
    }
  };

  // -----------------------------------------------------------------
  // 3️⃣ **Wrap the hook‑provided `createNewChat`** so that it first
  //    resets the system prompt to the default value.
  // -----------------------------------------------------------------
  const createNewChatWithDefaultPrompt = () => {
    // Reset the UI‑level prompt to the default before we create the session.
    setSystemPrompt(defaultSystemPrompt);

    // Call the original `createNewChat` that lives inside the hook.
    // It will create a brand‑new session whose `conversationHistory`
    // already contains the freshly‑reset prompt (because the hook
    // receives `systemPrompt` as an argument and we just set it above).
    chatSessions.createNewChat();
  };

  // -----------------------------------------------------------------
  // 4️⃣ Sync **from** the session → the UI state only when the session
  //    actually carries a differing value.
  // -----------------------------------------------------------------
  useEffect(() => {
    if (chatSessions.currentSessionId == null) return;

    const current = chatSessions.chatSessions.find(
      (s) => s.id === chatSessions.currentSessionId
    );
    if (!current) return;

    // ----- system prompt -------------------------------------------------
    if (
      current.systemPrompt &&                     // session has a prompt
      current.systemPrompt !== systemPrompt       // it differs from UI value
    ) {
      setSystemPrompt(current.systemPrompt);
    }

    // ----- model ---------------------------------------------------------
    if (current.model && current.model !== selectedModel) {
      setSelectedModel(current.model);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chatSessions.chatSessions,
    chatSessions.currentSessionId,
    // Intentionally *not* listing systemPrompt / selectedModel here.
  ]);

  // -----------------------------------------------------------------
  // Context value – expose everything the rest of the app needs.
  // -----------------------------------------------------------------
  const value = {
    ...chatSessions,
    ...messages,
    ...additionalInfo,
    currentUserId,
    systemPrompt,
    // expose the *wrapped* setters so UI components can call them
    setSystemPrompt: setSystemPromptAndSession,
    setSelectedModel: setSelectedModelAndSession,
    // *** IMPORTANT *** – expose the wrapped `createNewChat`
    createNewChat: createNewChatWithDefaultPrompt,
    user,
    signOut,
    selectedModel,
    showSettings,
    setShowSettings,
    activeSettingsSection,
    setActiveSettingsSection,
    // ➜ forward the hook's setter so consumers can inject the drawer opener
    setOpenSettingsOnNoToken: chatSessions.setOpenSettingsOnNoToken,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error(
      "useChatContext must be used within a ChatProvider"
    );
  }
  return ctx;
};