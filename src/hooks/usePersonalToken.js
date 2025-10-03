import { useState, useCallback } from 'react';
import { ChatService } from '../services/ChatService';
import { HuggingfaceService } from '../services/huggingface.service';
//import { useChatContext } from '../context/ChatContext';

/**
 * Hook to fetch a personal‑access token for the current user.
 *
 * @returns {{
 *   token: string,
 *   loading: boolean,
 *   error: string | null,
 *   getToken: () => Promise<void>
 * }}
 */
export const usePersonalToken = () => {
  //const { currentUserId, chatService } = useChatContext();
  const chatService = new ChatService(new HuggingfaceService());
  const currentUserId = "v@acrotron.com";

  //console.log("currentUserId: ", currentUserId);
  //console.log("chatService: ", chatService);
  //console.log("chatServiceX: ", chatServiceX);

  const [token, setToken]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  // `useCallback` prevents the function from being re‑created on every render.
  const getToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getToken(currentUserId);
      // API may return { token: 'abc' } or just the raw string.
      setToken(data?.token ?? data);
    } catch (e) {
      setError('Failed to retrieve token. Please try again.');
      console.error('usePersonalToken – getToken error:', e);
    } finally {
      setLoading(false);
    }
  }, [chatService, currentUserId]);

  return { token, loading, error, getToken };
};

