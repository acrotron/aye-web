export class ChatService {
  constructor(hfService) {
    this.hfService = hfService;
  }

  async loadAllSessions(userId) {
    try {
      return await this.hfService.loadChatSessions(userId);
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
      throw error;
    }
  }

  async loadSession(userId, chatId) {
    try {
      const [session] = await this.hfService.loadChatSessions(userId, chatId);
      return session;
    } catch (error) {
      console.error('Failed to load chat session:', error);
      throw error;
    }
  }

  async sendMessage(userId, chatId, message, model, systemPrompt) {
    try {
      return await this.hfService.callInvoke(userId, chatId, message, model, systemPrompt);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async sendDummyMessage() {
      const dummyMessage = JSON.parse('{"user_id": "amayorskiy@acrotron.com","chat_id": 135,"chat_title": "C Code for a Pokemon Game","assistant_response": "```c\\n#include <stdio.h>\\n\\nint main(void) {\\n    printf("Hello, World!\\n");\\n    return 0;\\n}\\n```","created_at": "2025-09-08 14:31:02+00:00","updated_at": "2025-09-26 18:27:31+00:00"}');
      return dummyMessage.JSON()
    }

  async getToken(userId) {
    try {
      return await this.hfService.getToken(userId);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async deleteSession(userId, chatId) {
    try {
      // Assuming the HF service has a delete method
      return await this.hfService.deleteChatSession?.(userId, chatId);
    } catch (error) {
      console.error('Failed to delete session:', error);
      throw error;
    }
  }
}

