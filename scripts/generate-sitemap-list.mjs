#!/usr/bin/env node

/**
 * Sitemap URL Generator for Niche Pages
 * Run: node scripts/generate-sitemap-list.mjs
 * Or with tsx: npx tsx scripts/generate-sitemap-list.ts
 *
 * Data source: src/data/nichePages.ts (NICHE_PAGES)
 * When adding niches, update NICHE_PAGES - slugs are derived automatically.
 */

const SITE_URL = "https://www.louuz.com";
const CHAT_BASE = "/chat";

// Slugs from src/data/nichePages.ts - keep in sync when adding new niches
const NICHE_SLUGS = [
    "brazil",
    "usa",
    "germany",
    "india",
    "anime",
    "lgbtq",
    "gamers",
    "teens",
    "music",
    "dating",
];

const today = new Date().toISOString().split("T")[0];

console.log("<!-- Copy these <url> entries into your sitemap.xml -->\n");

for (const slug of NICHE_SLUGS) {
    const loc = `${SITE_URL}${CHAT_BASE}/${slug}`;
    console.log(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
}

console.log("\n<!-- End of niche page URLs -->");