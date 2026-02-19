import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Globe, Sparkles, Zap, Video, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.louuz.com";

const OmegleAlternative = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Best Omegle Alternative 2026 — Faster, Safer, Modern | Louuz";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "The ultimate Omegle alternative. Modern UI, AI moderation, country filters, no lag. Free random video and text chat—the 2026 standard. Try Louuz now."
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}/omegle-alternative`);
  }, []);

  const handleEnterChat = (mode: "text" | "video") => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    navigate(mode === "video" ? "/video" : "/text-chat", {
      state: { name: `Guest${randomNum}`, gender: "unspecified" },
    });
  };

  const features = [
    {
      icon: Sparkles,
      title: "Modern UI",
      desc: "Clean, fast design. No clutter. Built for 2026.",
    },
    {
      icon: Shield,
      title: "Better Moderation",
      desc: "AI + human moderation. Report, skip, stay safe.",
    },
    {
      icon: Globe,
      title: "Country Filters",
      desc: "Match with Brazil, USA, Germany, India, and more.",
    },
    {
      icon: Zap,
      title: "Faster Matching",
      desc: "Quick connections. No endless waiting.",
    },
  ];

  const faqs = [
    {
      q: "Is Louuz better than Omegle?",
      a: "Louuz offers a modern interface, faster matching, country filters, and improved moderation. We're built for today's users—clean design, no outdated tech, and a focus on safety. Many users have switched and prefer the experience.",
    },
    {
      q: "Does Louuz have country filters?",
      a: "Yes. You can choose a region (e.g., Brazil, USA, Germany) before starting a chat. This helps you connect with people from specific countries. Matching is random within your selection.",
    },
    {
      q: "How is the moderation better?",
      a: "We use automated systems and human moderators to detect and act on rule violations. Users can report inappropriate behavior. Violators face permanent IP bans. Our goal is a safer, more respectful platform.",
    },
    {
      q: "Is it free like Omegle?",
      a: "Yes. Louuz is 100% free. No premium features, no paywalls. Video and text chat with strangers worldwide at no cost.",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
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

      {/* Hero */}
      <section className="relative z-10 pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight mb-6 drop-shadow-lg">
            The Ultimate Omegle Alternative — 2026
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Faster. Safer. Modern. Country filters, better moderation, and a UI built for today. The best random video and text chat—free.
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

      {/* Features Grid */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-zinc-900/60 border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors"
              >
                <f.icon className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-zinc-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="relative z-10 py-16 px-4">
        <article className="max-w-4xl mx-auto prose prose-invert prose-lg prose-headings:text-white prose-p:text-zinc-300 prose-strong:text-white">
          <h2 className="text-2xl font-bold text-white mb-4">
            Louuz: The 2026 Standard for Random Chat
          </h2>
          <p>
            Old random chat platforms feel outdated for a reason—they were built years ago. Louuz is designed for today. We offer the same thrill of meeting strangers, but with a modern interface, faster connections, and safety features that the classics never had. If you&apos;re looking for the best Omegle alternative, you&apos;ve found it.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            A Modern UI That Doesn&apos;t Look Ancient
          </h3>
          <p>
            Louuz has a clean, dark theme with intuitive controls. No cluttered layouts or confusing menus. Choose text or video, set your preferences, and start chatting. The experience is smooth on desktop and mobile—no app required. We built it so you spend time talking, not figuring out how it works.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Better Moderation for a Safer Experience
          </h3>
          <p>
            We combine automated systems with human moderators to catch rule-breakers. Report abusive users, and we act. Repeat offenders get permanent IP bans. Country filters let you narrow your matches. The result: fewer bad experiences and more real conversations.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Country Filters and Feature-Rich Matching
          </h3>
          <p>
            Want to talk to someone from Brazil, the USA, or Germany? Set your region and we&apos;ll prioritize matches from there. You can also filter by interest in our themed rooms. It&apos;s the upgrade users have been asking for—random chat with a bit more control.
          </p>
        </article>
      </section>

      {/* FAQ */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-zinc-900/60 border border-white/5 rounded-xl px-4"
              >
                <AccordionTrigger className="text-white hover:text-cyan-400 hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-400">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Try the Best Omegle Alternative Now
          </h2>
          <p className="text-zinc-400 mb-8">
            Free. Fast. Safer. No sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleEnterChat("text")}
              className="h-14 px-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold"
            >
              Start Text Chat
            </Button>
            <Button
              onClick={() => handleEnterChat("video")}
              className="h-14 px-10 rounded-full bg-white text-black hover:bg-zinc-200 text-lg font-bold"
            >
              Start Video Chat
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OmegleAlternative;
