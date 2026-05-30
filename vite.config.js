import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5188,         // Set a custom port unlikely to conflict
    strictPort: false,  // If 5188 is occupied, automatically increment to 5189, 5190, etc.
    open: true          // Automatically open the app in the browser on startup
  }
});
