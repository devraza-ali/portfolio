import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Served at github.io/portfolio/ (a subpath) until a custom domain (is-a.dev)
  // is live via public/CNAME — switch this to '/' once that's added.
  base: '/portfolio/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
});
