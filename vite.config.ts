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

// Puppeteer não funciona na Vercel (falta libnspr4, Chrome não inicia).
// Pre-render só em build local/CI; na Vercel o SPA é servido normalmente.
const isVercel = process.env.VERCEL === '1'

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
    // Pre-render: desativado na Vercel; ativo em build local
    ...(isVercel ? [] : [prerender({
      routes: ROUTES_TO_PRERENDER,
      renderer,
      rendererOptions: {
        renderAfterTime: 2500,
        headless: true,
      },
      // @ts-ignore
      postProcess(renderedRoute: any) {
        renderedRoute.html = renderedRoute.html
          .replace(/http:/i, 'https:')
          // Esta linha abaixo é a mágica que corrige o seu visual "bugado":
          .replace(/(<link.+?href="\/assets\/)/i, '<link rel="stylesheet" href="/assets/')
          .replace(/(<script.+?src="\/assets\/)/i, '<script defer src="/assets/');
        return renderedRoute;
      },
    })]),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "readable-stream": "vite-compatible-readable-stream",
    },
  },
})