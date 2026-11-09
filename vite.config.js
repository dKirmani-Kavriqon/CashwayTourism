import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_ROUTER=hash builds a copy that runs from any static file host
// (used for previews). Production uses clean URLs with a SPA fallback.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  build: { target: 'es2020', cssCodeSplit: true, chunkSizeWarningLimit: 600 },
});
