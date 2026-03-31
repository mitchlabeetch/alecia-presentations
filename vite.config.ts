import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@store': resolve(__dirname, './src/store'),
      '@lib': resolve(__dirname, './src/lib'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'react-vendor';
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'ui-vendor';
            if (id.includes('@dnd-kit')) return 'dnd-vendor';
            if (id.includes('@blocknote') || id.includes('prosemirror')) return 'blocknote-vendor';
            if (id.includes('convex')) return 'convex-vendor';
            if (id.includes('openai')) return 'ai-vendor';
            if (id.includes('pptxgenjs')) return 'pptxgen-vendor';
            if (id.includes('html2canvas') || id.includes('jspdf') || id.includes('jszip')) return 'export-vendor';
            if (id.includes('@tiptap')) return 'tiptap-vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@dnd-kit/core', 'framer-motion', 'sonner']
  }
});
