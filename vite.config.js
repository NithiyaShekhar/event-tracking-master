// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/utils/trackEvent.js',
      name: 'Tracker',
      fileName: () => 'tracker.js',
      formats: ['iife'], // iife = for browser use (like <script>)
    },
    outDir: 'public', // So Vercel serves it as a CDN file
    emptyOutDir: false,
  },
});
