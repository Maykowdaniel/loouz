import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import prerender from '@prerenderer/rollup-plugin'
import renderer from '@prerenderer/renderer-puppeteer'

const ROUTES_TO_PRERENDER = [
  '/',
  '/omegle-alternative',
  '/random-video-chat',
  '/anonymous-video-chat',
  '/talk-to-strangers',
]

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'util', 'events', 'stream'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    // Pre-render para SEO: Google, Bing e redes sociais leem HTML estático
    prerender({
      routes: ROUTES_TO_PRERENDER,
      renderer,
      rendererOptions: {
        renderAfterTime: 2500, // Aguarda React mount + useEffect (title, meta, canonical)
        headless: true,
      },
      postProcess(renderedRoute) {
        // Converte URLs locais para produção
        if (renderedRoute.html) {
          renderedRoute.html = renderedRoute.html
            .replace(/http:\/\//gi, 'https://')
            .replace(/(https:\/\/)?(localhost|127\.0\.0\.1):\d*/gi, 'https://www.louuz.com')
        }
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