// services/huggingface.service.js
import api from "../api/axiosClient";
import { environment } from '../environments/environment';

export class HuggingfaceService {
  constructor() {
    this.apiUrl = environment.apiUrl || 'https://your-api-gateway-url.amazonaws.com';
    this.hfApiUrl = environment.hfApiUrl || 'https://api-inference.huggingface.co';
    this.hfToken = environment.hfToken || 'your-huggingface-token';
  }

  async callInvoke(userId, chatId, userInput, model = 'gpt-4o', systemPrompt = null) {
    console.log("hfService: User input: ", userInput);
    console.log("hfService: Selected model: ", model);
    console.log("hfService: System prompt: ", systemPrompt);
    
    try {
      const payload = {
        user_id: userId,
        chat_id: chatId,
        message: userInput,
        model: model // Include the model in the API call
      };
      
      // Include system prompt if provided
      if (systemPrompt) {
        payload.system_prompt = systemPrompt;
      }
      
      const response = await api.post(`${this.apiUrl}/invoke`, payload);
      console.log("hfService: response.data: ", response.data);
      return response.data;
    } catch (error) {
      console.error('Error calling Lambda API:', error);
      throw error;
    }
  }

  async loadChatSessions(userId, chatId, userInput) {
    try {
      const response = await api.post(`${this.apiUrl}/sessions`, {
        user_id: userId,
        chat_id: chatId,
        user_input: userInput
      });
      return response.data;
    } catch (error) {
      console.error('Error calling Lambda API:', error);
      throw error;
    }
  }

  async getToken(userId) {
    try {
      const response = await api.post(`${this.apiUrl}/token`, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch token: ${error.message}`);
    }
  }
}

