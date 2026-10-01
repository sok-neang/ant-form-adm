import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://web-api-registration.ant.com.kh',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://web-api-registration.ant.com.kh',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})