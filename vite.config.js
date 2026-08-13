import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages serves project sites from /<repository-name>/.
  base: '/ikun-adventure/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
