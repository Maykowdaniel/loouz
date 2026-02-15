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
}

/** Placeholders used in templates: [Niche], [NicheName], [Emoji] */
export const NICHE_PAGES: NichePageData[] = [
  {
    slug: "brazil",
    title: "Brazil Video Chat | Talk to Brazilians Online - Louuz",
    description: "Free video and text chat with people from Brazil. Meet Brazilians online, practice Portuguese, make friends. No login required.",
    h1: "Brazil Chat – Connect with Brazilians Worldwide",
    emoji: "🇧🇷",
    displayName: "Brazil",
    keywords: ["brazil chat", "brazilian video chat", "chat with brazilians", "brazil random chat", "omgele brasil"],
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
    description: "Free video chat with people from Germany. Meet Germans, practice German, make international friends. No registration.",
    h1: "Germany Chat – Connect with Germans Online",
    emoji: "🇩🇪",
    displayName: "Germany",
    keywords: ["germany chat", "german video chat", "chat with germans", "deutschland chat", "omegle germany"],
  },
  {
    slug: "india",
    title: "India Video Chat | Chat with Indians Online - Louuz",
    description: "Free random video and text chat with people from India. Meet Indians, make friends, practice Hindi or English. No login.",
    h1: "India Chat – Talk to Indians Worldwide",
    emoji: "🇮🇳",
    displayName: "India",
    keywords: ["india chat", "indian video chat", "chat with indians", "india random chat", "omegle india"],
  },
  {
    slug: "anime",
    title: "Anime Chat | Video Chat for Anime Fans - Louuz",
    description: "Meet anime fans in random video chat. Discuss your favorite shows, cosplay, manga. Free and anonymous. No signup.",
    h1: "Anime Chat – Connect with Anime Fans",
    emoji: "🎌",
    displayName: "Anime",
    keywords: ["anime chat", "anime video chat", "chat with anime fans", "anime random chat", "weeb chat"],
  },
  {
    slug: "lgbtq",
    title: "LGBTQ+ Video Chat | Safe Space to Meet - Louuz",
    description: "Safe and inclusive video chat for the LGBTQ+ community. Meet like-minded people, make friends. Anonymous and free.",
    h1: "LGBTQ+ Chat – A Safe Space to Connect",
    emoji: "🏳️‍🌈",
    displayName: "LGBTQ+",
    keywords: ["lgbtq chat", "gay video chat", "lgbt random chat", "queer chat", "inclusive chat"],
  },
  {
    slug: "gamers",
    title: "Gamers Video Chat | Meet Gamers Online - Louuz",
    description: "Random video chat for gamers. Discuss games, find duo partners, share setups. Free and no login required.",
    h1: "Gamers Chat – Meet Fellow Gamers Online",
    emoji: "🎮",
    displayName: "Gamers",
    keywords: ["gamers chat", "gamer video chat", "chat with gamers", "gaming chat", "streamer chat"],
  },
  {
    slug: "teens",
    title: "Video Chat for Teens 18+ | Safe Random Chat - Louuz",
    description: "Random video chat for young adults 18+. Meet people your age, make friends. Safe, anonymous, and free. No registration.",
    h1: "Teens Chat – Connect with People Your Age",
    emoji: "👋",
    displayName: "Teens",
    keywords: ["teens chat", "teen video chat", "18+ chat", "young adults chat", "random chat teens"],
  },
  {
    slug: "music",
    title: "Music Lovers Video Chat | Chat with Music Fans - Louuz",
    description: "Meet music lovers in random video chat. Discuss genres, share playlists, discover new artists. Free and anonymous.",
    h1: "Music Chat – Connect with Music Lovers",
    emoji: "🎵",
    displayName: "Music",
    keywords: ["music chat", "music video chat", "chat with music fans", "music lovers chat", "random music chat"],
  },
  {
    slug: "dating",
    title: "Dating Video Chat | Meet Singles Online - Louuz",
    description: "Random video chat to meet new people for dating. Talk to singles, make connections. Free, anonymous, no signup.",
    h1: "Dating Chat – Meet New People for Dating",
    emoji: "💕",
    displayName: "Dating",
    keywords: ["dating chat", "dating video chat", "meet singles", "random dating chat", "video dating"],
  },
];

/** Lookup niche by slug. Returns undefined if not found. */
export function getNicheBySlug(slug: string): NichePageData | undefined {
  return NICHE_PAGES.find((n) => n.slug === slug);
}

/** All slugs for sitemap and routing validation */
export const NICHE_SLUGS = NICHE_PAGES.map((n) => n.slug);
