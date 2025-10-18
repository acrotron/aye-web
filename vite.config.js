import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd());
  const defineEnv = {
    'import.meta.env': JSON.stringify({
      ...env,
      MODE: mode,
    }),
  };

  //define: {
  //  'process.env': env
  //},
  //
  return {

  define: defineEnv,

  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',                // accept connections from any IP
    port: 3000,
    strictPort: true,               // abort if 3000 is busy
    open: false,                    // don’t auto‑open a browser on the local machine
    
    // --------------------------------------------------------------
    // Allowed hosts – you can use exact strings, wildcards or regexes.
    //   • 'localhost'   – always keep for local development
    //   • '<your‑local‑ip>' – e.g. '192.168.1.42'
    //   • '.my‑company.com' – any sub‑domain of this domain
    //   • /.*\.ngrok\.io/   – regex for ngrok URLs
    // --------------------------------------------------------------
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.acrotron.com',         // optional wildcard
      '.ayechat.ai',         // optional wildcard
      /.*\.ngrok\.io/          // allow ngrok tunnels
    ],
    // --------------------------------------------------------------
    // CORS – optional but handy when you hit the dev server from a
    // different origin (e.g., from a mobile app or another local service)
    // --------------------------------------------------------------
    cors: {
      origin: '*',           // change to a specific origin in production
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  },
  };
})
