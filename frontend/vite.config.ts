import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const devPort = Number(env.VITE_DEV_PORT || 5173);

    const resolveProxyTarget = () => {
      const rawApiUrl = (env.VITE_API_URL || '').trim();
      if (!rawApiUrl) {
        return 'http://localhost:3011';
      }

      try {
        const parsed = new URL(rawApiUrl);
        return parsed.origin;
      } catch {
        return 'http://localhost:3011';
      }
    };

    return {
      server: {
        port: devPort,
        strictPort: true,
        host: '0.0.0.0',
        hmr: {
          host: env.VITE_HMR_HOST || 'localhost',
          protocol: env.VITE_HMR_PROTOCOL === 'wss' ? 'wss' : 'ws',
          port: devPort,
          clientPort: devPort,
        },
        // during development proxy API requests to the backend server so
        // the frontend can call '/api/...' without CORS or manual env setup.
        proxy: {
          '/api': {
            target: resolveProxyTarget(),
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
        minify: 'esbuild',
        cssMinify: true,
        
        // Enable tree-shaking
        rollupOptions: {
          output: {
            // Manual chunks for better caching
            manualChunks: {
              // React and core libraries
              'vendor-react': ['react', 'react-dom', 'react-router'],
              // HTTP client (used by the primary bundle) - kept small and separate
              // from charts so heavy admin-only libs don't ship on first load.
              'vendor-axios': ['axios'],
              // Charts - admin dashboard only, never loaded on the public site
              'vendor-charts': ['recharts'],
              // SEO & meta framework
              'vendor-seo': ['react-helmet-async'],
              // Icons
              'vendor-icons': ['lucide-react'],
            },
          }
        },
        
        // Chunk size warning limit
        chunkSizeWarningLimit: 500,
        
        // CSS optimization
        cssCodeSplit: true,
        
        // Asset optimization
        assetsInlineLimit: 4096,
        
        // Enable brotli compression
        reportCompressedSize: true
      },
      
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router', 'axios'],
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
        port: devPort + 1,
        host: '0.0.0.0'
      }
    };
});
