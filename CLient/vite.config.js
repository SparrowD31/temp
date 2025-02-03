import path from "path";
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // Use the environment variable for the backend URL
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
