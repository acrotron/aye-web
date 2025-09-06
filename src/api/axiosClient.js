// src/api/axiosClient.js
import axios from "axios";
import { environment } from '../environments/environment';
import { getAuthToken } from "../auth/getAuthToken";

/**
 * Base URL of your API‑Gateway.
 * You can change the env var name or hard‑code the URL if you prefer.
 */
const api = axios.create({
  baseURL: environment.apiUrl,
});

/**
 * Request interceptor – runs before each request.
 * It fetches a fresh JWT (Amplify refreshes it for you) and attaches it.
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        // Ensure we keep any existing headers
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    } catch (e) {
      // No token (user probably signed out). Let the request go – the backend will return 401.
      console.warn("Unable to obtain auth token for request:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

