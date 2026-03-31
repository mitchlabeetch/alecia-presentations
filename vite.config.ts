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
            // React core - keep first
            if (id.includes('react-dom')) return 'react-vendor';
            
            // Editor: BlockNote + Tiptap + Prosemirror + Mantine (they share deps)
            if (id.includes('@blocknote') || id.includes('@tiptap') || id.includes('prosemirror') || id.includes('@mantine') || id.includes('@remirror')) return 'editor-vendor';
            
            // UI animations and icons
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'ui-vendor';
            
            // Drag and drop
            if (id.includes('@dnd-kit')) return 'dnd-vendor';
            
            // Convex backend
            if (id.includes('convex')) return 'convex-vendor';
            
            // AI/OpenAI
            if (id.includes('openai')) return 'ai-vendor';
            
            // pptxgenjs standalone
            if (id.includes('pptxgenjs')) return 'pptxgen-vendor';
            
            // Export libraries (html2canvas, jspdf, jszip)
            if (id.includes('html2canvas') || id.includes('jspdf') || id.includes('jszip')) return 'export-vendor';
            
            // React hooks and utils
            if (id.includes('react/')) return 'react-vendor';
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
