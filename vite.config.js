import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/events': 'http://localhost:5000' // ✅ Used for local API (json-server)
    }
  },
  build: {
    outDir: 'dist'  // 🔧 Ensures the build output goes to "dist"
  }
});
