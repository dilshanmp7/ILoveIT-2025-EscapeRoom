import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Proxy API calls to the local API server for development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        timeout: 5000, // 5 second timeout for local server
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🚨 Local API error:', err.message)
            // Send a proper error response instead of letting it hang
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(
                JSON.stringify({
                  success: false,
                  error:
                    'Local tournament API is not running. Please start it with: npm run api:local',
                  offline: true,
                })
              )
            }
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📡 Local API request:', req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Local API response:', proxyRes.statusCode)
          })
        },
      },
    },
  },
})
