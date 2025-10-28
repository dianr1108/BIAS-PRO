import { defineConfig } from 'vite';

export default defineConfig({
  // Vite akan membangun dari folder "client"
  root: 'client',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true
  }
});
