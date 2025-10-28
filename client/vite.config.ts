import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',                 // pakai folder client sebagai root
  build: {
    outDir: '../dist/public', // keluarkan ke dist/public di ROOT repo
    emptyOutDir: true
  }
})
