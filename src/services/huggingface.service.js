// services/huggingface.service.js
import api from "../api/axiosClient";
import axios from "axios";                     // <— add this
import { environment } from '../environments/environment';

export class HuggingfaceService {
  constructor() {
    this.apiUrl = environment.apiUrl || 'https://your-api-gateway-url.amazonaws.com';
    this.hfApiUrl = environment.hfApiUrl || 'https://api-inference.huggingface.co';
    this.hfToken = environment.hfToken || 'your-huggingface-token';

    this.pollIntervalMs = 2000;               // 2s
    this.pollTimeoutMs  = 120000;             // 2 min
  }

  async callInvoke(userId, chatId, userInput, model = 'gpt-4o', systemPrompt = null) {
    //console.log("hfService: User input: ", userInput);
    //console.log("hfService: Selected model: ", model);
    //console.log("hfService: System prompt: ", systemPrompt);

    const payload = {
      user_id: userId,
      chat_id: chatId,
      message: userInput,
      model: model
    };

    if (systemPrompt) {
      payload.system_prompt = systemPrompt;
    }

    try {
      const response = await api.post(`${this.apiUrl}/invoke`, payload);
      console.log("hfService: response.data: ", response.data);
      console.log("something: ", response.data?.body);
      //console.log("responseUrl: ", response.data.get("response_url"));
      console.log("status: ", response.status);

      // If server already returned the final payload, just return it
      if (response.status !== 202 || !response.data?.body?.response_url) {
        //return response.data;
      }

      // Otherwise poll the presigned GET URL until the object exists, then return it
      const responseUrl =
        (typeof response.data.body === 'string'
          ? JSON.parse(response.data.body)
          : response.data.body
        )?.response_url;

      const deadline = Date.now() + this.pollTimeoutMs;
      const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
      let lastStatus = null;
    console.log("MARK 3");

      while (Date.now() < deadline) {
        try {
          // Use axios directly (not the pre-configured api instance)
          //const r = await axios.get(responseUrl, { timeout: 30000 });
          const r = await axios.get(responseUrl);
          lastStatus = r.status;
          if (r.status === 200) {
            return r.data; // same shape as original resp.json()
          }
          // Any unexpected non-200 continues to polling loop
        } catch (err) {
          if (err.response) {
            lastStatus = err.response.status;
            // S3 typically returns 403/404 until the object is present
            if (lastStatus === 403 || lastStatus === 404) {
              await sleep(this.pollIntervalMs);
              continue;
            }
            // Other HTTP errors: rethrow
            throw err;
          } else {
            // Network/timeout errors: keep polling
            await sleep(this.pollIntervalMs);
            continue;
          }
        }
        await sleep(this.pollIntervalMs);
      }

      throw new Error(`Timed out waiting for response object at ${responseUrl} (last status=${lastStatus})`);
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

