import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@scss': path.resolve(__dirname, './src/assests/scss'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        api: 'modern-compiler',
        silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'],
        additionalData: `@use "@scss/mixins.scss"; @use "@scss/variables.scss";`, //
      },
    },
    devSourcemap: true,
  },
  build: {
    target: 'esnext',
  },
  define: {
    'process.env': {},
  },
  worker: {
    format: 'es',
  },
});
