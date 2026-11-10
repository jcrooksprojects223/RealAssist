// The React plugin lets Vite transform JSX and refresh edited React components during development.
import react from '@vitejs/plugin-react'
// defineConfig provides editor hints and checks for this Vite configuration object.
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Export the settings Vite uses for both the development server and production build.
export default defineConfig({
  // Enable the React plugin for the application.
  plugins: [react()],
})
