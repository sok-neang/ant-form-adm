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
        target: 'https://ant-form-backend.production.rms.publicvm.com',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://ant-form-backend.production.rms.publicvm.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})