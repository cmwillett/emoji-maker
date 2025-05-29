// uno.config.ts
import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  presets: [presetUno()],
  shortcuts: [
    ['btn-primary', 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow cursor center'],
  ]
})
