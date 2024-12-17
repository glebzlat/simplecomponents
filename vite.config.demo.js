import vue from '@vitejs/plugin-vue';
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: './demo/index.html'
    },
    outDir: './dist.demo',
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  server: {
    open: './demo/index.html'
  },
  plugins: [vue()]
});
