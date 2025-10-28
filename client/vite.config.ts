import { defineConfig } from 'vite'

export default defineConfig({
  // build dijalankan dari folder "client"
  root: '.',
  build: {
    // keluarkan hasil ke root/dist/public (sesuai yang dipakai Vercel)
    outDir: '../dist/public',
    emptyOutDir: true
  }
})
