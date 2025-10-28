import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, 'src'),
      'src': path.resolve(__dirname, 'src'),
    }
  },
  build: {
    outDir: '../dist/public',
    emptyOutDir: true
  }
})
