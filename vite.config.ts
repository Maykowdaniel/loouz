import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { nodePolyfills } from 'vite-plugin-node-polyfills' // <--- Importe o plugin

export default defineConfig({
  plugins: [
    react(),
    // Esse plugin injeta Buffer, util, events, process... tudo automático!
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'events', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "readable-stream": "vite-compatible-readable-stream",
    },
  },
})