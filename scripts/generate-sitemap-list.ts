/**
 * Sitemap URL Generator for Niche Pages
 * Run: npx tsx scripts/generate-sitemap-list.ts
 * Copy the output into your sitemap.xml
 *
 * Single source of truth: src/data/nichePages.ts
 */

import { NICHE_PAGES } from "../src/data/nichePages";

const SITE_URL = "https://www.louuz.com";
const CHAT_BASE = "/chat";
const today = new Date().toISOString().split("T")[0];

console.log("<!-- Copy these <url> entries into your sitemap.xml -->\n");

for (const niche of NICHE_PAGES) {
  const loc = `${SITE_URL}${CHAT_BASE}/${niche.slug}`;
  console.log(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
}

console.log("\n<!-- End of niche page URLs -->");
