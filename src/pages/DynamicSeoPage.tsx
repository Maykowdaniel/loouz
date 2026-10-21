import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Layers, HelpCircle, Video, Keyboard, X, Mail, CheckCircle2 
} from "lucide-react";
import Footer from "@/components/Footer";
import { getNicheBySlug, type NichePage } from "@/data/nichePages";
import { io, Socket } from "socket.io-client";

const SITE_URL = "https://www.louuz.com";
const CHAT_BASE = "/chat";
const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const FAQ_TEMPLATES = [
  {
    question: "Is [Niche] chat free on Louuz?",
    answer: "Yes. Louuz is 100% free. There are no subscriptions or paid features. Video and text chat with [NicheName] users and everyone else is completely free.",
  },
  {
    question: "Do I need to create an account for [Niche] chat?",
    answer: "No. Louuz works without registration. You can start [Niche] chat immediately. No email, phone, or social login required.",
  },
  {
    question: "Can I choose to only chat with [NicheName] people?",
    answer: "Matching is random, so you can meet anyone from anywhere. [NicheName] users are active on Louuz, so you'll encounter them naturally. The diversity is part of the experience.",
  },
  {
    question: "Is [Niche] chat safe?",
    answer: "Louuz uses AI moderation and user reporting to keep the platform safe. Never share personal information. Use the report button if you encounter inappropriate behavior. All users must be 18+.",
  },
  {
    question: "Does [Niche] chat work on mobile?",
    answer: "Yes. Louuz is fully responsive. You can use [Niche] chat on iPhone, Android, or any device with a modern browser. No app download needed.",
  },
];

/** Substitui as tags de texto simples sem bugar com Regex */
function applyPlaceholders(text: string, niche: NichePage): string {
  return text
    .replaceAll("[NicheName]", niche.name)
    .replaceAll("[Niche]", niche.name)
    .replaceAll("[Emoji]", niche.emoji);
}

const DynamicSeoPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Estados Globais da Página
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'text' | 'video' | null>(null);

  // Estados de Filtros (Gênero)
  const [myGender, setMyGender] = useState<'m' | 'f'>('m'); 
  const [lookingFor, setLookingFor] = useState<'m' | 'f' | 'any'>('any'); 

  // Estados do E-mail de Notificação
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailRegistered, setEmailRegistered] = useState<boolean>(false);

  // Estado do número real de usuários online
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const socketRef = useRef<Socket | null>(null);

  const niche = slug ? getNicheBySlug(slug) : undefined;

  // Escuta a contagem global em tempo real via Socket.io
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("global_online_count", (data: { count: number }) => {
      setOnlineCount(data.count);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Intercepta o clique para abrir o Modal de Configurações
  const handleInitialClick = (mode: 'text' | 'video') => {
    setPendingMode(mode);
    setIsFilterModalOpen(true);
  };

  // Confirma e redireciona para o chat com as configurações
  const handleConfirmChat = () => {
    if (!pendingMode) return;
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const guestName = `Guest${randomNum}`;
    const targetPath = pendingMode === 'video' ? "/video" : "/text-chat";

    navigate(targetPath, { 
      state: { 
        name: guestName, 
        country: slug || "global", // Envia o país atual da rota (ex: "usa")
        gender: myGender,
        lookingFor: lookingFor,
        from: window.location.pathname // Guarda a rota de origem
      } 
    });
  };

  // Envia o e-mail para o backend via Socket.io para salvar no MongoDB
  const handleRegisterNotificationEmail = () => {
    if (userEmail && userEmail.includes("@")) {
      socketRef.current?.emit("register_notification_email", { email: userEmail });
      setEmailRegistered(true);
    } else {
      alert("Please enter a valid email address.");
    }
  };

  useEffect(() => {
    document.body.style.overflow = (isMenuOpen || isFilterModalOpen) ? "hidden" : "unset";
  }, [isMenuOpen, isFilterModalOpen]);

  useEffect(() => {
    if (niche) {
      document.title = `${niche.h1Title} | Louuz`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", niche.metaDescription);
      let linkCanonical = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement | null;
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", `${SITE_URL}${CHAT_BASE}/${niche.slug}`);
    }
  }, [niche]);

  // 404: slug não existe → redirect para Home
  useEffect(() => {
    if (slug !== undefined && !niche) {
      navigate("/", { replace: true });
    }
  }, [slug, niche, navigate]);

  if (!niche) return null;

  const intro = `${niche.emoji} ${niche.name} chat on Louuz lets you connect with people who share your interest or culture. Free video and text chat, no login, no barriers. Start talking to strangers from around the world right now.`;

  const faq = FAQ_TEMPLATES.map((t) => ({
    question: applyPlaceholders(t.question, niche),
    answer: applyPlaceholders(t.answer, niche),
  }));

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Efeitos de Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- MODAL DE CONFIGURAÇÕES (MATCH SETTINGS) --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsFilterModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-xl font-bold text-white">Match Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(false)}>
                <X className="text-zinc-400" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
                {/* 1. SELEÇÃO DE GÊNERO */}
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">I am</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setMyGender('m')} className={`h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${myGender === 'm' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                            <span className="text-lg">👨</span> Male
                        </button>
                        <button onClick={() => setMyGender('f')} className={`h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${myGender === 'f' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                            <span className="text-lg">👩</span> Female
                        </button>
                    </div>
                </div>

                {/* 2. PROCURANDO POR */}
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Looking for</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setLookingFor('m')} className={`h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${lookingFor === 'm' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                            <span className="text-lg">👨</span> Guys
                        </button>
                        <button onClick={() => setLookingFor('f')} className={`h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${lookingFor === 'f' ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                            <span className="text-lg">👩</span> Girls
                        </button>
                        <button onClick={() => setLookingFor('any')} className={`h-12 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${lookingFor === 'any' ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                            <span className="text-lg">👥</span> Both
                        </button>
                    </div>
                </div>

                {/* 3. AVISO DE HORÁRIO DE PICO & E-MAIL DE NOTIFICAÇÃO (OPCIONAL) */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-xl p-3 flex flex-col gap-1 text-center">
                      <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                          🔥 Best Peak Hours
                      </span>
                      <span className="text-xs text-zinc-300">
                          Higher activity daily from <strong className="text-white">8 PM to 11 PM (UTC)</strong>
                      </span>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                          Notify me when active (Optional)
                      </label>
                      <div className="flex gap-2">
                          <input 
                              type="email" 
                              placeholder="your@email.com"
                              value={userEmail}
                              onChange={(e) => setUserEmail(e.target.value)}
                              disabled={emailRegistered}
                              className="flex-1 bg-zinc-800/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                          />
                          <button
                              type="button"
                              onClick={handleRegisterNotificationEmail}
                              disabled={emailRegistered || !userEmail}
                              className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-3 py-2 rounded-xl text-xs uppercase transition-all disabled:opacity-40 flex items-center gap-1"
                          >
                              {emailRegistered ? <CheckCircle2 size={14} /> : <Mail size={14} />}
                              {emailRegistered ? "Saved" : "Notify"}
                          </button>
                      </div>
                      {emailRegistered && (
                          <p className="text-[11px] text-emerald-400 mt-1">
                              ✓ We will notify you when peak activity starts!
                          </p>
                      )}
                  </div>
                </div>

            </div>
            <div className="p-6 border-t border-white/5 bg-zinc-900/50">
              <Button onClick={handleConfirmChat} className="w-full h-14 rounded-xl text-lg font-black uppercase tracking-wide bg-white text-black hover:bg-zinc-200">
                Start {pendingMode === 'video' ? 'Video' : 'Text'} Chat
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header com Menu */}
      <div className="absolute top-0 right-0 p-6 z-[60]">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/5 rounded-full h-14 w-14 transition-all relative z-50 group"
          onClick={() => setIsMenuOpen(true)}
        >
          <div className="flex flex-col gap-[6px] items-end group">
            <div className="w-8 h-[2px] bg-purple-400 rounded-full group-hover:w-6 transition-all" />
            <div className="w-6 h-[2px] bg-purple-400 rounded-full group-hover:w-8 transition-all" />
            <div className="w-4 h-[2px] bg-purple-400 rounded-full group-hover:w-6 transition-all" />
          </div>
        </Button>
      </div>

      {/* Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#18181b] border-t border-white/10 sm:border sm:rounded-[30px] rounded-t-[30px] shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden">
            <div
              className="flex justify-center pt-3 pb-1"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full cursor-pointer" />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <MenuItem
                icon={<Home size={20} />}
                label="Home"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/");
                }}
              />
              <MenuItem
                icon={<Layers size={20} />}
                label="Rooms"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/rooms");
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <div className="relative flex flex-col items-center justify-center pt-10 px-4 w-full max-w-4xl mx-auto z-10">
        <div
          className="mb-8 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700"
          onClick={() => navigate("/")}
        >
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            lo<span className="text-cyan-400">uu</span>z
          </h1>
        </div>

        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <h2 className="text-5xl sm:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-lg">
            TALK TO
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              STRANGERS
            </span>
          </h2>
        </div>

        {/* CONTADOR EM TEMPO REAL */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 px-8 py-4 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] z-10 animate-pulse" />
              <div className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75 scale-150" />
            </div>
            <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              {onlineCount.toLocaleString()}
            </span>
            <span className="text-emerald-400 font-bold text-sm sm:text-base uppercase tracking-[0.2em] mt-1">
              Online Users
            </span>
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-12">
          <Button
            onClick={() => handleInitialClick("video")}
            className="w-full h-16 sm:h-[80px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-200 animate-pulse-scale"
          >
            <div className="flex items-center gap-4">
              <Video
                size={28}
                className="text-white drop-shadow-md"
                strokeWidth={3}
              />
              <div className="flex flex-col items-start leading-none text-shadow">
                <span className="text-[11px] uppercase font-bold text-cyan-100 tracking-wider mb-0.5">
                  Cam On
                </span>
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic">
                  START VIDEO CHAT
                </span>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleInitialClick("text")}
            className="w-full h-16 sm:h-[72px] rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-[1.01] active:scale-95 transition-all duration-200 border-0 shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <Keyboard
                size={24}
                className="text-black group-hover:text-cyan-600 transition-colors"
                strokeWidth={2.5}
              />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">
                  Fast Mode
                </span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                  START TEXT CHAT
                </span>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* CONTEÚDO SEO */}
      <main className="relative flex flex-col flex-grow px-4 w-full max-w-4xl mx-auto z-10 pb-16">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider opacity-80">
            {niche.emoji} {niche.h1Title}
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mt-4 leading-relaxed">
            {intro}
          </p>
        </div>

        <article
          className="space-y-6 border-t border-white/10 pt-16 prose prose-invert prose-p:text-zinc-400 prose-p:leading-relaxed max-w-4xl mx-auto"
          dangerouslySetInnerHTML={{ __html: niche.seoContent }}
        />

        {/* FAQ */}
        <section className="mt-20 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {faq.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
              >
                <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-2">
                  <HelpCircle
                    className="text-purple-500 shrink-0"
                    size={20}
                  />
                  {item.question}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed pl-8">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-16 text-center">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="rounded-full border-white/20 text-white hover:bg-white/10"
          >
            Back to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const MenuItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 px-4 py-4 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl transition-all group"
  >
    <div className="text-zinc-500 group-hover:text-cyan-400 transition-colors">
      {icon}
    </div>
    <span className="text-lg font-medium tracking-tight">{label}</span>
  </button>
);

export default DynamicSeoPage;