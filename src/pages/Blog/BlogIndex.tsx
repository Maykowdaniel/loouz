import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { BLOG_POSTS, type BlogPost } from "@/data/blogPosts";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const FEATURED = BLOG_POSTS[0];
const RECENT = BLOG_POSTS.slice(1, 3);
const GRID_POSTS = BLOG_POSTS.slice(3, 7);

function stripHtml(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

function BlogCard({
  post,
  size = "default",
}: {
  post: BlogPost;
  size?: "default" | "featured" | "compact";
}) {
  const excerpt = stripHtml(post.content);
  const isFeatured = size === "featured";
  const isCompact = size === "compact";

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <div
          className={`bg-zinc-800/50 transition-transform duration-300 group-hover:scale-105 ${
            isFeatured ? "aspect-[16/9]" : isCompact ? "aspect-video" : "aspect-[4/3]"
          }`}
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className={isCompact ? "p-4" : "p-6"}>
        <h2
          className={`font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 ${
            isFeatured ? "text-2xl sm:text-3xl" : isCompact ? "text-base" : "text-xl"
          }`}
        >
          {post.title}
        </h2>
        <p className="mt-2 text-zinc-400 text-sm line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {format(new Date(post.date), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <User size={14} />
            {post.author}
          </span>
        </div>
        <span className="inline-flex items-center gap-2 mt-3 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
          Read More
          <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

const BlogIndex = () => {
  useEffect(() => {
    document.title = "Blog — Omegle Alternative Tips & Random Chat Guides | Louuz";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Expert guides on random chat, Omegle alternatives, and talking to strangers. Safety tips, conversation starters, and why Louuz is the best free chat platform."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-white hover:text-cyan-400 transition-colors"
          >
            lo<span className="text-cyan-400">uu</span>z
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/blog"
              className="text-cyan-400 font-semibold text-sm"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-16">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">
            Louuz <span className="text-cyan-400">Blog</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            Tips, guides, and insights on random chat, Omegle alternatives, and meeting strangers online.
          </p>
        </section>

        {/* Featured + Recent */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <BlogCard post={FEATURED} size="featured" />
          </div>
          <div className="flex flex-col gap-6">
            {RECENT.map((post) => (
              <BlogCard key={post.id} post={post} size="compact" />
            ))}
          </div>
        </section>

        {/* Grid Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GRID_POSTS.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BlogIndex;
