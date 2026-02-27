import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3011,
        host: '0.0.0.0',
        // during development proxy API requests to the backend server so
        // the frontend can call '/api/...' without CORS or manual env setup.
        proxy: {
          '/api': {
            target: env.VITE_API_URL || 'http://localhost:3010',
            changeOrigin: true,
            secure: false,
            // keep path as-is
            rewrite: (path) => path,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        // Enable source maps for debugging
        sourcemap: mode === 'development',
        
        // Optimize chunk size
        target: 'esnext',
        minify: false,
        cssMinify: true,
        
        // Code splitting configuration
        rollupOptions: {
          output: {
            // Manual chunks for better caching
            manualChunks: {
              // React and core libraries
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              // HTTP client and utilities
              'vendor-utils': ['axios', 'recharts'],
            },
          }
        },
        
        // Chunk size warning limit
        chunkSizeWarningLimit: 1000,
        
        // CSS optimization
        cssCodeSplit: true,
        
        // Asset optimization
        assetsInlineLimit: 4096,
        
        // Enable brotli compression
        reportCompressedSize: true
      },
      
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'axios'],
      },
      
      // CSS configuration
      css: {
        devSourcemap: true,
        modules: {
          localsConvention: 'camelCaseOnly'
        }
      },
      
      // Performance hints
      preview: {
        port: 3012,
        host: '0.0.0.0'
      }
    };
});
