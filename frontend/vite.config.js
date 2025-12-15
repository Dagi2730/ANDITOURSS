// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ---------------------------------
  // CRITICAL PROXY CONFIGURATION 
  // ---------------------------------
  server: {
    proxy: {
      // This key '/api' is the path prefix the frontend looks for.
      '/api': {
        // 'target' is the address of your Express backend server.
        target: 'http://localhost:8000', 
        changeOrigin: true, // Needed for making the proxy behave like the real origin
        secure: false, // Recommended for local development
      },
    },
  },
  // ---------------------------------
})