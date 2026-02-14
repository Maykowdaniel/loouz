# Pre-rendering SEO

O projeto usa **@prerenderer/rollup-plugin** + **Puppeteer** para gerar HTML estático das rotas principais no build.

**Importante:** O prerender é **desativado automaticamente na Vercel** (Puppeteer precisa de libnspr4/Chrome, que não existe no ambiente de build). O build na Vercel usa apenas o SPA. Para obter HTML pré-renderizado, rode `npm run build` localmente e faça deploy dos arquivos `dist/` manualmente, ou use um CI com suporte a Chrome.

## Rotas pré-renderizadas

- `/` (Home)
- `/omegle-alternative`
- `/random-video-chat`
- `/anonymous-video-chat`
- `/talk-to-strangers`

## Como funciona

1. **Build**: `npm run build` → Vite compila → Plugin inicia servidor local com `dist/`
2. **Puppeteer** visita cada rota com Chromium headless
3. **Aguarda 2.5s** (`renderAfterTime`) para React mount + useEffect (title, meta, canonical)
4. **Captura** o HTML final e salva em `dist/[rota]/index.html`
5. **Vercel** serve o HTML estático para crawlers (Google, Bing, redes sociais)

## Title e Meta

As tags `<title>`, `<meta name="description">` e `<link rel="canonical">` são atualizadas em **useEffect** no `SeoLandingPage` e `Index`. O prerender aguarda `renderAfterTime` para capturá-las. Não é necessário react-helmet-async.

## Build

```bash
npm run build
```

O prerender roda automaticamente durante o build. Tempo estimado: ~6-10s adicional.
