import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Zap, Heart, Sparkles, Video, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.louuz.com";

const TalkToStrangers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Talk to Strangers — Make Global Friends Instantly | Louuz";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Talk to strangers worldwide. Cure boredom, make friends, and have real conversations. Filter by country, text or video—free, instant, no login. Join thousands online now."
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}/talk-to-strangers`);
  }, []);

  const handleEnterChat = (mode: "text" | "video") => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    navigate(mode === "video" ? "/video" : "/text-chat", {
      state: { name: `Guest${randomNum}`, gender: "unspecified" },
    });
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Connections",
      desc: "Match in seconds. No waiting, no queue. Click and chat.",
    },
    {
      icon: Globe,
      title: "Filter by Country",
      desc: "Connect with people from Brazil, USA, Germany, India, and more.",
    },
    {
      icon: Heart,
      title: "Make Real Friends",
      desc: "From small talk to deep conversations. Your next friend is one click away.",
    },
    {
      icon: Sparkles,
      title: "Cure Boredom",
      desc: "Never be bored again. Thousands online 24/7, ready to chat.",
    },
  ];

  const faqs = [
    {
      q: "How do I talk to strangers on Louuz?",
      a: "Simply click Start Text Chat or Start Video Chat. You'll be connected to a random stranger in seconds. No sign-up required. Skip to the next person anytime if the conversation isn't a fit. It's that easy.",
    },
    {
      q: "Can I filter by country?",
      a: "Yes. On the home page, you can set a region preference (e.g., Brazil, USA, Germany) before starting. This helps you meet people from specific parts of the world. Matching is still random within your chosen region.",
    },
    {
      q: "What are good icebreaker ideas?",
      a: "Try asking where they're from, what they're doing today, or share a fun fact. 'What's the best thing that happened to you this week?' and 'If you could travel anywhere right now, where?' work great. Be genuine and curious.",
    },
    {
      q: "Is it free to talk to strangers?",
      a: "Yes. Louuz is 100% free. No subscriptions, no premium tiers, no hidden fees. Text and video chat with strangers worldwide at no cost.",
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
            Talk to Strangers — Make Friends Instantly
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Cure boredom. Meet people worldwide. Text or video—no sign-up, no waiting. Your next great conversation is one click away.
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
            Why People Love to Talk to Strangers on Louuz
          </h2>
          <p>
            There&apos;s something special about a conversation with someone you&apos;ve never met. No baggage, no expectations—just two people connecting in the moment. Louuz makes that happen in seconds. Whether you&apos;re bored, lonely, or curious about the world, thousands of strangers are online right now, ready to chat. No profile, no follow-up pressure. Just talk.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Cure Boredom With Real Conversations
          </h3>
          <p>
            Scrolling through feeds gets old. Louuz is different. One click puts you face-to-face (or text-to-text) with a real person. Maybe you&apos;ll discuss a movie, share a joke, or learn about life in another country. Every chat is a chance to break the monotony and maybe make a friend.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Make Global Friends
          </h3>
          <p>
            Use our country filters to meet people from Brazil, the USA, Germany, India, and beyond. Practice a language, learn about cultures, or simply broaden your perspective. The world is full of interesting people—Louuz connects you with them instantly.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Icebreaker Ideas That Work
          </h3>
          <p>
            Stuck on what to say? Try: &quot;Where are you from?&quot; &quot;What are you up to today?&quot; or &quot;What&apos;s the best thing that happened to you this week?&quot; A simple &quot;Hey, how&apos;s it going?&quot; works too. Most people are happy to chat—you just have to start.
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
            Start Talking to Strangers Right Now
          </h2>
          <p className="text-zinc-400 mb-8">
            Thousands online. One click to connect. Free forever.
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

export default TalkToStrangers;
