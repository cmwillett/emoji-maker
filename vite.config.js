import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  plugins: [
    react(),
    UnoCSS(),
    VitePWA({
      /*workbox: {
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024 // 30 MB
      },*/
      workbox: {
        globIgnores: ['**/*.wasm']
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Emoji Maker',
        short_name: 'EmojiMaker',
        description: 'Turn images into emoji!',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
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
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})
