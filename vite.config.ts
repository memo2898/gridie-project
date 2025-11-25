import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/wc/MyElement.ts'),
      name: 'MyElement',
      fileName: (format) => `my-element.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Asegúrate de externalizar dependencias que no quieres en el bundle
      external: [],
      output: {
        globals: {}
      }
    },
    outDir: 'dist',
    emptyOutDir: false
  }
});