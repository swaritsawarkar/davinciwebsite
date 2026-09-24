import { defineConfig } from 'vite';

export default defineConfig({
  base: '/hyperdrive/',
  build: {
    outDir: '../public/hyperdrive',
    emptyOutDir: true,
  },
});
