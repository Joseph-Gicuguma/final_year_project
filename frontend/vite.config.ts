import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // port: 6600,
    port: process.env.PORT ? parseInt(process.env.PORT) : 6600,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['reservo-frontend.onrender.com']
  },
});
