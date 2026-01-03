import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace 'REPO_NAME' with your actual GitHub repository name
  // e.g. base: '/tradeanchor-landing/'
  // If deploying to a custom domain (e.g. tradeanchor.com), set base: '/'
  base: '/', 
})
