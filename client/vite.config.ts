import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  plugins: [
    {
      // Paksa perbaiki path absolut di index.html ("/src/...") jadi relatif ("./src/...")
      name: 'fix-absolute-src-in-index',
      transformIndexHtml(html) {
        return html.replace(/src\s*=\s*["']\s*\/src\//g, 'src="./src/');
      }
    }
  ],
  build: {
    outDir: '../dist/public',
    emptyOutDir: true
  }
})
