import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  root: '.',                     // jalankan dari folder client
  resolve: {
    alias: {
      // Biar "/src/xxx" dan "src/xxx" dua-duanya ke-resolve ke client/src
      '/src': path.resolve(__dirname, 'src'),
      'src': path.resolve(__dirname, 'src'),
    }
  },
  build: {
    outDir: '../dist/public',    // output ke root/dist/public
    emptyOutDir: true
  }
})
