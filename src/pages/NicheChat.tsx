import { useEffect } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare } from "lucide-react";
import Footer from "@/components/Footer";
import { getNicheBySlug } from "@/data/nichePages";

const NicheChat = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const niche = slug ? getNicheBySlug(slug) : undefined;

  useEffect(() => {
    if (niche) {
      document.title = `${niche.h1Title} | Louuz`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", niche.metaDescription);
      }
    }
  }, [niche]);

  const handleEnterChat = (mode: "text" | "video") => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    navigate(mode === "video" ? "/video" : "/text-chat", {
      state: { name: `Guest${randomNum}`, gender: "unspecified" },
    });
  };

  if (slug !== undefined && !niche) {
    return <Navigate to="/" replace />;
  }

  if (!niche) return null;

  return (
    <div className="relative flex flex-col min-h-screen bg-zinc-900 overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <header className="relative z-50 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md">
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
              to="/lobby"
              className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              Lobby
            </Link>
            <Link
              to="/rooms"
              className="text-cyan-400 font-semibold text-sm"
            >
              Rooms
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl sm:text-8xl mb-4">{niche.emoji}</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 drop-shadow-lg">
            {niche.h1Title}
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect with people instantly, no login required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <Button
              onClick={() => handleEnterChat("text")}
              className="h-14 px-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] text-lg font-bold"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Text Chat
            </Button>
            <Button
              onClick={() => handleEnterChat("video")}
              className="h-14 px-8 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-bold border-0"
            >
              <Video className="mr-2 h-5 w-5" />
              Start Video Chat
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content Area */}
      <section className="relative z-10 px-4 pb-16">
        <div
          className="max-w-3xl mx-auto prose prose-invert my-12 prose-p:text-zinc-400 prose-headings:text-white prose-a:text-cyan-400"
          dangerouslySetInnerHTML={{ __html: niche.seoContent }}
        />
      </section>

      <Footer />
    </div>
  );
};

export default NicheChat;
