import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, ChevronDown, MoreVertical, Layers } from "lucide-react"; // Adicionei MoreVertical e Layers
import { useTranslation } from "react-i18next";
import SeoExpansion from "@/components/SeoExpansion";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Estado para o contador fake
  const [onlineCount, setOnlineCount] = useState(1500);
  
  // Estado para controlar o menu (3 pontinhos)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lógica do contador (mantida)
  useEffect(() => {
    document.title = t('page_title'); 
    document.documentElement.lang = i18n.language;

    const initial = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    setOnlineCount(initial);

    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; 
        const next = prev + change;
        if (next < 1000) return 1000;
        if (next > 2000) return 2000;
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [t, i18n.language]);

  const scrollToContent = () => {
    document.getElementById('more-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- NOVA FUNÇÃO: ENTRAR DIRETO (Bypass Setup) ---
  const handleEnterChat = (mode: 'text' | 'video') => {
    // 1. Gerar nome aleatório
    const randomNum = Math.floor(Math.random() * 90000) + 10000; // Ex: 10000 a 99999
    const guestName = `Guest${randomNum}`;

    // 2. Definir destino
    const targetPath = mode === 'video' ? "/video" : "/text-chat";

    // 3. Navegar passando o estado (Gênero padrão: unspecified)
    navigate(targetPath, { 
      state: { 
        name: guestName, 
        gender: "unspecified" 
      } 
    });
  };

  return (
    <div className="gradient-bg flex flex-col min-h-screen">
      <style>{`
        @keyframes radar {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .animate-radar { animation: radar 3s infinite ease-out; }
      `}</style>

      {/* --- HEADER COM MENU --- */}
      <div className="absolute top-0 right-0 p-6 z-50">
        <div className="relative" ref={menuRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 rounded-full h-12 w-12"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={28} />
          </Button>

          {/* Menu Dropdown Simples */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fade-in-up z-50">
              <button 
                onClick={() => navigate("/rooms")}
                className="w-full text-left px-4 py-3 text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
              >
                <Layers size={18} className="text-purple-400" />
                <span className="font-medium">Salas (Rooms)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-start px-4 py-6">
        
        {/* Espaço reservado para o Header */}
        <div className="flex-none h-4"></div>

        {/* Conteúdo Central */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl z-10 mt-8 sm:mt-16">
          
          {/* Logo Gigante */}
          <div className="animate-fade-in-up mb-4 scale-125 sm:scale-150 origin-bottom">
            <h1 className="text-glow-purple text-8xl font-black tracking-tighter sm:text-9xl md:text-[11rem] leading-none">
              lo<span className="text-accent">uu</span>z
            </h1>
          </div>

          <h2 
            className="animate-fade-in-up mb-4 max-w-3xl text-center text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-br from-white via-purple-50 to-purple-400 bg-clip-text text-transparent drop-shadow-sm leading-tight pb-2"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            {t('intro')}
          </h2>

          <p
            className="animate-fade-in-up mb-8 max-w-md text-center text-base text-zinc-400 sm:text-lg font-medium"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            {t('omegle')}
          </p>

           {/* INDICADOR DE USUÁRIOS ONLINE */}
          <div 
            className="animate-fade-in-up mb-6 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            style={{ animationDelay: "0.05s", opacity: 0 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {onlineCount.toLocaleString()} {t('online_now')}
          </div>

          {/* ✅ BOTÕES COM AÇÃO DIRETA (XL) */}
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            {/* Botão de Texto - AGORA VAI DIRETO */}
            <Button
              onClick={() => handleEnterChat('text')}
              className="h-16 w-64 sm:h-20 sm:w-80 rounded-full bg-zinc-200 text-zinc-900 hover:bg-white hover:scale-105 transition-all text-xl sm:text-2xl font-black uppercase tracking-wider shadow-lg border-0 z-20"
            >
              {t('btn_enter')}
            </Button>

            {/* Botão de Vídeo - AGORA VAI DIRETO */}
            <Button
              onClick={() => handleEnterChat('video')}
              className="relative z-10 h-16 w-64 sm:h-20 sm:w-80 rounded-full gradient-btn text-white hover:box-glow-purple hover:scale-105 transition-all text-xl sm:text-2xl font-black uppercase tracking-wider shadow-xl shadow-purple-900/30 border-0"
            >
              <span className="absolute -z-10 inset-0 rounded-full animate-radar bg-white"></span>
              <Video className="mr-3 h-8 w-8 sm:h-9 sm:w-9 relative z-20" />
              <span className="relative z-20">{t('btn_video')}</span>
            </Button>
          </div>
        </div>

        {/* Rodapé fixo embaixo */}
        <div className="flex flex-col items-center gap-3 mb-2 animate-fade-in-up z-10 mt-auto" style={{ animationDelay: "0.45s", opacity: 0 }}>
          <p className="text-center text-[10px] sm:text-xs text-muted-foreground/50 max-w-sm px-4">
            {t('age_warning_1')}
            <button
              onClick={() => navigate("/terms")}
              className="text-white/40 underline underline-offset-2 transition-colors hover:text-accent ml-1"
            >
              {t('age_warning_2')}
            </button>{" "}
            {t('age_warning_3')}
          </p>

          <div 
            onClick={scrollToContent}
            className="animate-bounce cursor-pointer text-white/20 hover:text-white transition-colors"
          >
            <ChevronDown size={24} />
          </div>
        </div>
      </div>
      
      {/* Âncora para rolagem */}
      <div id="more-content"></div>

      <SeoExpansion />
    </div>
  );
};

export default Index;