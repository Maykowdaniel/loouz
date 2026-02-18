/**
 * Structured data for Long Tail SEO pages - /chat/:slug
 * Each niche/country gets a dedicated page with unique metadata and dynamic content.
 */

export interface NichePageData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  emoji: string;
  keywords: string[];
  /** Short name for placeholders (e.g. "Brazil", "Anime") */
  displayName: string;
  /** (Novo) Frase na língua nativa para SEO Local */
  nativeH1?: string; 
}

/** Placeholders used in templates: [Niche], [NicheName], [Emoji] */
export const NICHE_PAGES: NichePageData[] = [
  {
    slug: "brazil",
    title: "Brazil Video Chat | Talk to Brazilians Online - Louuz",
    description: "Free video and text chat with people from Brazil. Meet Brazilians online. Chat em vídeo com brasileiros grátis. No login required.",
    h1: "Brazil Chat – Connect with Brazilians Worldwide",
    nativeH1: "Chat de Vídeo com Brasileiros", // <--- O Google ama isso
    emoji: "🇧🇷",
    displayName: "Brazil",
    keywords: ["brazil chat", "brazilian video chat", "chat with brazilians", "videochamada aleatoria", "conversar com estranhos"],
  },
  {
    slug: "usa",
    title: "USA Video Chat | Chat with Americans Online - Louuz",
    description: "Talk to people from USA online. Free random video chat with Americans. No signup. Start chatting now.",
    h1: "USA Chat – Meet Americans in Random Video Chat",
    emoji: "🇺🇸",
    displayName: "USA",
    keywords: ["usa chat", "american video chat", "chat with americans", "usa random chat", "omegle usa"],
  },
  {
    slug: "germany",
    title: "Germany Video Chat | Chat with Germans - Louuz",
    description: "Free video chat with people from Germany. Meet Germans, practice German. Kostenloser Videochat auf Deutsch. No registration.",
    h1: "Germany Chat – Connect with Germans Online",
    nativeH1: "Kostenloser Videochat mit Fremden", // <--- Alemão Nativo
    emoji: "🇩🇪",
    displayName: "Germany",
    keywords: ["germany chat", "german video chat", "chat with germans", "deutschland chat", "videochat mit fremden"],
  },
  {
    slug: "india",
    title: "India Video Chat | Chat with Indians Online - Louuz",
    description: "Free random video and text chat with people from India. Meet Indians, make friends. Free Indian Video Chat. No login.",
    h1: "India Chat – Talk to Indians Worldwide",
    nativeH1: "Free Random Video Chat India",
    emoji: "🇮🇳",
    displayName: "India",
    keywords: ["india chat", "indian video chat", "chat with indians", "india random chat", "desi video chat"],
  },
  
];

/** Lookup niche by slug. Returns undefined if not found. */
export function getNicheBySlug(slug: string): NichePageData | undefined {
  return NICHE_PAGES.find((n) => n.slug === slug);
}

/** All slugs for sitemap and routing validation */
export const NICHE_SLUGS = NICHE_PAGES.map((n) => n.slug);