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
      // Proxy API calls to production with enhanced error handling
      '/api': {
        target: 'https://dhllockdowngame.vercel.app',
        changeOrigin: true,
        secure: true,
        timeout: 30000, // Increased timeout to 30 seconds
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('🚨 Production API error:', err.message)
            console.log('🔧 Consider using local API server if connection issues persist')
            if (!res.headersSent) {
              res.writeHead(503, { 'Content-Type': 'application/json' })
              res.end(
                JSON.stringify({
                  success: false,
                  error:
                    'Production tournament API is temporarily unavailable. Please try again later.',
                  offline: true,
                  suggestion: 'Run "npm run dev:full" to use local API server',
                })
              )
            }
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('📡 Production API request:', req.url)
            // Add headers that might help with connection
            proxyReq.setHeader('User-Agent', 'Vite-Dev-Proxy/1.0')
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Production API response:', proxyRes.statusCode)
          })
        },
      },
    },
  },
})
