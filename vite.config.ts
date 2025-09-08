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
      // Proxy API calls to production for unified database access
      '/api': {
        target: 'https://dhllockdowngame.vercel.app',
        changeOrigin: true,
        secure: true,
        timeout: 10000, // 10 second timeout for production API
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🚨 Production API error:', err.message)
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(
                JSON.stringify({
                  success: false,
                  error: 'Production tournament API is not available. Please try again later.',
                  offline: true,
                })
              )
            }
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📡 Production API request:', req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Production API response:', proxyRes.statusCode)
          })
        },
      },
    },
  },
})
