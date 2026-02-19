import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, EyeOff, UserX, Video, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.louuz.com";

const AnonymousChat = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title =
      "Anonymous Chat — No Login, Encrypted 1v1 | Louuz";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Anonymous video and text chat with zero personal data. No sign-up, no tracking, encrypted peer-to-peer. Start chatting privately in seconds — 100% free."
      );
    }
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}/anonymous-chat`);
  }, []);

  const handleEnterChat = (mode: "text" | "video") => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    navigate(mode === "video" ? "/video" : "/text-chat", {
      state: { name: `Guest${randomNum}`, gender: "unspecified" },
    });
  };

  const features = [
    {
      icon: Shield,
      title: "Zero Personal Data",
      desc: "No email, no phone, no sign-up. Your identity stays yours.",
    },
    {
      icon: Lock,
      title: "Encrypted P2P",
      desc: "Direct peer-to-peer connections. We never store your chats.",
    },
    {
      icon: EyeOff,
      title: "Untraceable",
      desc: "No persistent identifiers. Leave when you want, no trail.",
    },
    {
      icon: UserX,
      title: "No Account Ever",
      desc: "One click and you're in. No profiles, no history to delete.",
    },
  ];

  const faqs = [
    {
      q: "Is Louuz really anonymous?",
      a: "Yes. We do not require any sign-up or personal information. You connect as a guest. We don't store chat logs or video streams, and we minimize data collection. Your conversations are direct between you and the other user.",
    },
    {
      q: "Do I need to create an account?",
      a: "No. Louuz works entirely without registration. Click Start Text Chat or Start Video Chat and you're connected in seconds. No email, no social login, no barriers.",
    },
    {
      q: "Is my chat encrypted?",
      a: "Connections use modern security protocols. We facilitate peer-to-peer chat where possible, and we do not intercept or store your messages or video. Your privacy is our priority.",
    },
    {
      q: "Can someone trace me after we chat?",
      a: "We don't store conversations or build profiles. Once you disconnect, there's no persistent record of your session on our side. Always avoid sharing personal details with strangers.",
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
            Anonymous Chat — No Login, No Trace
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Chat privately with strangers. Zero personal data. Encrypted peer-to-peer. Start in seconds — no sign-up ever.
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
            The Safest Anonymous Chat Platform — No Login Required
          </h2>
          <p>
            Louuz is built for people who value privacy. Unlike social networks or messaging apps that demand your email, phone number, or profile, we require nothing. Click once, and you&apos;re in a 1v1 chat with a stranger—text or video. Your identity stays yours. We don&apos;t store your conversations, build profiles, or track you across sessions.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Why Anonymous Chat Matters
          </h3>
          <p>
            Anonymous chat lets you explore, vent, or connect without the pressure of your real identity. Maybe you want to practice a language, discuss an awkward topic, or simply meet someone new without judgment. Louuz gives you that space. No accounts mean no data leaks, no hacks of your profile, and no permanent record of who you talked to.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            Encrypted Peer-to-Peer Connections
          </h3>
          <p>
            We connect you directly to another user. When possible, chat flows peer-to-peer—we don&apos;t sit in the middle reading your messages. We don&apos;t record video streams or log text. Our systems facilitate the connection; your conversation stays between you and the stranger on the other side.
          </p>

          <h3 className="text-xl font-bold text-white mt-8 mb-3">
            No Sign-Up, No Barriers
          </h3>
          <p>
            Other platforms make you create an account, verify your email, or link social profiles. Louuz doesn&apos;t. Open the site, choose text or video, and you&apos;re matched in seconds. Skip anyone you don&apos;t want to talk to. Report anyone who crosses the line. Your privacy is the default—not an opt-in.
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
            Start Chatting Anonymously Right Now
          </h2>
          <p className="text-zinc-400 mb-8">
            No sign-up. No personal data. One click to connect.
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

export default AnonymousChat;
