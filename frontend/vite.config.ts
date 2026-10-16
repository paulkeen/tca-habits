import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // GitHub Codespaces serves the dev server on *.app.github.dev. Not `true`:
    // allowing every host is a DNS-rebinding hazard.
    allowedHosts: ['.app.github.dev'],
    proxy: {
      '/habits': 'http://localhost:8000',
      '/stats': 'http://localhost:8000',
      '/encouragement': 'http://localhost:8000',
    },
  },
})
