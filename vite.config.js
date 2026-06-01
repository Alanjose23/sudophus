import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://alanjose23.github.io/sudophus/ on GitHub Pages.
  // Use '/' for local dev / custom-domain root deploys.
  base: '/sudophus/',
  plugins: [react()],
})