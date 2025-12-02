import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// 1. Get your repository name from GitHub (e.g. if your repo is https://github.com/user/my-landing-page, the name is 'my-landing-page')
// 2. Replace '/FlowioLanding-React/' below with '/YOUR-REPO-NAME/'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Add this line here!
      base: '/Flowio-react-V01/', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
