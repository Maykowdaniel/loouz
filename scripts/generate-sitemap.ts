/**
 * Dynamic Sitemap Generator for Louuz
 * Run: npx tsx scripts/generate-sitemap.ts
 * Or: npm run generate-sitemap
 *
 * Generates public/sitemap.xml from:
 * - Static routes
 * - src/data/nichePages.ts (chat pages)
 * - src/data/blogPosts.ts (blog posts)
 */

import { writeFileSync } from "fs";
import { resolve } from "path";
import { NICHE_PAGES } from "../src/data/nichePages";
import { BLOG_POSTS } from "../src/data/blogPosts";

// 1. CORRIGIDO: Adicionado o www
const BASE_URL = "https://www.louuz.com";

// 2. CORRIGIDO: Criada a variável 'today' que estava faltando
const today = new Date().toISOString().split("T")[0];

const xmlEscape = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

function urlEntry(
  loc: string,
  options: { lastmod?: string; changefreq?: string; priority?: number } = {}
): string {
  const { lastmod, changefreq, priority } = options;
  let xml = `  <url>\n    <loc>${xmlEscape(loc)}</loc>`;
  if (lastmod) xml += `\n    <lastmod>${lastmod}</lastmod>`;
  if (changefreq) xml += `\n    <changefreq>${changefreq}</changefreq>`;
  if (priority !== undefined) xml += `\n    <priority>${priority}</priority>`;
  xml += `\n  </url>`;
  return xml;
}

const urls: string[] = [];

// 1. Static routes (priority 1.0, changefreq daily)
const staticRoutes = [
  { path: "/", changefreq: "daily", priority: 1.0 },
  { path: "/text-chat", changefreq: "daily", priority: 1.0 },
  { path: "/video", changefreq: "daily", priority: 1.0 },
  { path: "/rooms", changefreq: "daily", priority: 1.0 },
];

for (const route of staticRoutes) {
  urls.push(
    urlEntry(`${BASE_URL}${route.path}`, {
      lastmod: today,
      changefreq: route.changefreq,
      priority: route.priority,
    })
  );
}

// 2. Legal pages (priority 0.6, changefreq monthly - E-E-A-T)
const legalRoutes = [
  "/privacy-policy",
  "/terms-of-service",
  "/community-guidelines",
];
for (const path of legalRoutes) {
  urls.push(
    urlEntry(`${BASE_URL}${path}`, {
      lastmod: today,
      changefreq: "monthly",
      priority: 0.6,
    })
  );
}

// 3. Money Pages - High-converting landing pages (priority 0.85)
const landingPages = [
  "/anonymous-chat",
  "/talk-to-strangers",
  "/omegle-alternative",
];
for (const path of landingPages) {
  urls.push(
    urlEntry(`${BASE_URL}${path}`, {
      lastmod: today,
      changefreq: "weekly",
      priority: 0.85,
    })
  );
}

// 4. Blog index
urls.push(
  urlEntry(`${BASE_URL}/blog`, {
    lastmod: today,
    changefreq: "daily",
    priority: 0.8,
  })
);

// 5. Dynamic niche pages (priority 0.9, changefreq weekly)
for (const niche of NICHE_PAGES) {
  urls.push(
    urlEntry(`${BASE_URL}/chat/${niche.slug}`, {
      lastmod: today,
      changefreq: "weekly",
      priority: 0.9,
    })
  );
}

// 6. Dynamic blog posts (priority 0.7, lastmod from date)
for (const post of BLOG_POSTS) {
  const lastmod = post.date ? post.date.split("T")[0] : undefined;
  urls.push(
    urlEntry(`${BASE_URL}/blog/${post.slug}`, {
      lastmod,
      changefreq: "monthly",
      priority: 0.7,
    })
  );
}

// Build full sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

// Write to public/sitemap.xml
const outputPath = resolve(process.cwd(), "public", "sitemap.xml");
writeFileSync(outputPath, sitemap, "utf-8");

console.log(`✓ Sitemap generated: ${outputPath}`);
console.log(`  - ${staticRoutes.length} static routes`);
console.log(`  - ${legalRoutes.length} legal pages`);
console.log(`  - ${landingPages.length} landing pages`);
console.log(`  - 1 blog index`);
console.log(`  - ${NICHE_PAGES.length} niche pages`);
console.log(`  - ${BLOG_POSTS.length} blog posts`);
console.log(`  Total: ${urls.length} URLs`);