import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Using '.' as the path to look for .env files
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react({ jsxRuntime: 'classic' })],
    define: {
      // Shim process.env for compatibility with code using process.env.API_KEY etc.
      'process.env': env
    }
  };
});