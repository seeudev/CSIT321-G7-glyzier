import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration
 * 
 * Configuration for Vite build tool.
 * 
 * Simplified architecture:
 * - Build output goes to 'dist' directory
 * - Spring Boot copies 'dist' to 'static' folder
 * - No base path needed since served from root
 * - Assets use relative paths automatically
 * 
 * Build command: npm run build
 * Output: dist/ folder with production-ready files
 * 
 * @author Glyzier Team
 * @version 2.0 - Simplified architecture
 */
export default defineConfig({
  plugins: [react()],
  build: {
    // Output directory for production build
    outDir: 'dist',
    
    // Generate source maps for debugging production issues
    sourcemap: false,
    
    // Clean the output directory before building
    emptyOutDir: true,
    
    // Asset handling
    assetsDir: 'assets',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Development server configuration
    port: 5173,
    
    // Proxy API requests to Spring Boot during development
    // This allows frontend dev server to work with backend
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
