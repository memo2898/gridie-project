import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/gridie/index.ts'),
      name: 'Gridie',
      formats: ['es', 'umd'],
      fileName: (format) => `gridie.${format}.js`
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'gridie.css';
          return assetInfo.name || '';
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2015'
  }
});