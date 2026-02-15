import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Layers, Info, HelpCircle, Video, Keyboard } from "lucide-react"; // Adicionei Video e Keyboard
import { seoPages, type SeoPageData } from "@/data/seoPages";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.louuz.com";

const SeoLandingPage = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- LÓGICA DO CONTADOR (Copiada da Home) ---
  const [onlineCount, setOnlineCount] = useState(1384);

  useEffect(() => {
    // Atualiza o contador a cada 4 segundos
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return prev + change;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterChat = (mode: 'text' | 'video') => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const guestName = `Guest${randomNum}`;
    const targetPath = mode === 'video' ? "/video" : "/text-chat";

    navigate(targetPath, { state: { name: guestName, gender: "unspecified" } });
  };
  // ---------------------------------------------

  const pageData: SeoPageData | undefined = seoPages[pathname];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (pageData) {
      document.title = pageData.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", pageData.description);
      }
      let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!linkCanonical) {
        linkCanonical = document.createElement("link");
        linkCanonical.setAttribute("rel", "canonical");
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.setAttribute("href", `${SITE_URL}${pathname}`);
    }
  }, [pageData, pathname]);

  if (!pageData) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Efeitos de Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header com Menu */}
      <div className="absolute top-0 right-0 p-6 z-[60]">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/5 rounded-full h-14 w-14 transition-all relative z-50 group"
          onClick={() => setIsMenuOpen(true)}
        >
          <div className="flex flex-col gap-[6px] items-end group">
            <div className="w-8 h-[2px] bg-purple-400 rounded-full group-hover:w-6 transition-all"></div>
            <div className="w-6 h-[2px] bg-purple-400 rounded-full group-hover:w-8 transition-all"></div>
            <div className="w-4 h-[2px] bg-purple-400 rounded-full group-hover:w-6 transition-all"></div>
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
            <div className="flex justify-center pt-3 pb-1" onClick={() => setIsMenuOpen(false)}>
              <div className="w-12 h-1.5 bg-zinc-700 rounded-full cursor-pointer" />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <MenuItem icon={<Home size={20} />} label="Home" onClick={() => { setIsMenuOpen(false); navigate("/"); }} />
              <MenuItem icon={<Layers size={20} />} label="Rooms" onClick={() => { setIsMenuOpen(false); navigate("/rooms"); }} />
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION (Interface da Home) --- */}
      <div className="relative flex flex-col items-center justify-center pt-10 px-4 w-full max-w-4xl mx-auto z-10">
        
        {/* LOGO */}
        <div 
          className="mb-8 cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700"
          onClick={() => navigate("/")}
        >
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            lo<span className="text-cyan-400">uu</span>z
          </h1>
        </div>

        {/* HEADLINE PRINCIPAL (Visual) */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <h2 className="text-5xl sm:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-lg">
            TALK TO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              STRANGERS
            </span>
          </h2>
        </div>

        {/* CONTADOR */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 px-8 py-4 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <div className="relative flex items-center justify-center mb-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] z-10 animate-pulse"></div>
                    <div className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75 scale-150"></div>
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
            onClick={() => handleEnterChat('video')}
            className="w-full h-16 sm:h-[80px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-200 animate-pulse-scale"
          >
            <div className="flex items-center gap-4">
              <Video size={28} className="text-white drop-shadow-md" strokeWidth={3} />
              <div className="flex flex-col items-start leading-none text-shadow">
                <span className="text-[11px] uppercase font-bold text-cyan-100 tracking-wider mb-0.5">Cam On</span>
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic">START VIDEO CHAT</span>
              </div>
            </div>
          </Button>
          
          <Button
            onClick={() => handleEnterChat('text')}
            className="w-full h-16 sm:h-[72px] rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-[1.01] active:scale-95 transition-all duration-200 border-0 shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <Keyboard size={24} className="text-black group-hover:text-cyan-600 transition-colors" strokeWidth={2.5} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">Fast Mode</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">START TEXT CHAT</span>
              </div>
            </div>
          </Button>
        </div>
      </div>

      {/* --- CONTEÚDO SEO (Fica abaixo para o Google ler) --- */}
      <main className="relative flex flex-col flex-grow px-4 w-full max-w-4xl mx-auto z-10 pb-16">
        
        {/* Título H1 Específico para SEO (Ex: "Omegle Alternative") */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-2xl sm:text-3xl font-bold text-white uppercase tracking-wider opacity-80">
                {pageData.h1}
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mt-4 leading-relaxed">
                {pageData.intro}
            </p>
        </div>

        {/* Artigos */}
        <article className="space-y-16 border-t border-white/10 pt-16">
          {pageData.article.map((section, idx) => (
            <section
              key={idx}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                {section.title}
              </h2>
              <div className="text-zinc-400 leading-relaxed space-y-4">
                {section.content.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className="text-base sm:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {/* FAQ */}
        <section className="mt-20 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6">
            {pageData.faq.map((item, idx) => (
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

        {/* Rodapé CTA */}
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

export default SeoLandingPage;