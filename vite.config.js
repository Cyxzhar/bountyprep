import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'logo.png'],
      manifest: {
        name: 'BountyPrep',
        short_name: 'BountyPrep',
        description: 'Master Bug Bounty Hunting & Cybersecurity through interactive challenges.',
        theme_color: '#0A0A0F',
        background_color: '#0A0A0F',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        sourcemap: false
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group heavy libraries into their own chunks
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('react-syntax-highlighter')) {
              return 'vendor-syntax';
            }
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) {
              return 'vendor-markdown';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-ui-icons';
            }

            // Core react and other smaller utilities in one vendor chunk
            // Moving react out of 'vendor-react-core' to avoid circular dependencies with other libs
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200,
  }
})
