import vue from '@vitejs/plugin-vue';
import { defineConfig } from "vite";
import { resolve } from 'node:path';

console.log(__dirname)

export default defineConfig({
  root: __dirname,
  build: {
    rollupOptions: {
      input: resolve(__dirname, './index.html')
    },
    outDir: '../dist.demo',
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  plugins: [vue()]
});
