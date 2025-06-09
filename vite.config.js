import { defineConfig } from 'vite' // Vite's config helper
import react from '@vitejs/plugin-react' // React plugin for Vite (with Fast Refresh)
import UnoCSS from 'unocss/vite' // UnoCSS utility-first CSS engine
import { VitePWA } from 'vite-plugin-pwa' // PWA support for Vite

export default defineConfig({
  base: '/', // Base public path for the app
  build: {
    outDir: 'dist', // Output directory for production build
  },
  plugins: [
    react(), // Enables React Fast Refresh and JSX support
    UnoCSS(), // Enables UnoCSS utility classes
    VitePWA({
      // PWA plugin configuration
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // Allow caching files up to 50 MB
        globIgnores: ['**/*.wasm'], // Ignore WASM files in service worker cache
      },
      registerType: 'autoUpdate', // Automatically update service worker
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'], // Static assets to include in the build
      manifest: {
        // Web app manifest for installable PWA
        name: 'Emoji Maker',
        short_name: 'EmojiMaker',
        description: 'Turn images into emoji!',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone', // Launch as a standalone app
        start_url: '/', // Start URL when installed
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
            purpose: 'any maskable' // Supports maskable icons for Android/iOS
          }
        ]
      }
    })
  ],
  resolve: {
    dedupe: ['react', 'react-dom'], // Prevent duplicate React instances in the bundle
  },
})