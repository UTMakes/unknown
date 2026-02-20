import { defineConfig } from 'vite';

// Vite config for local development only
// Production deployment on Vercel uses static file serving (no build step)
export default defineConfig({
  // Dev server configuration
  server: {
    port: 3000,
    open: true
  },

  // Preview server configuration  
  preview: {
    port: 4173
  }
});
