import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const apiProxyTarget = process.env.VITE_DEV_API_TARGET || 'http://127.0.0.1:8000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
});
