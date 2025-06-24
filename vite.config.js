import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Calender-react/', // ✅ Required for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      '/events': 'http://localhost:5000' // ✅ Used for local API (json-server)
    }
  }
});
