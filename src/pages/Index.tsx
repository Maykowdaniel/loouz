import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Keyboard, 
  Layers, 
  Home, 
  Info,
  Zap 
} from "lucide-react"; 
import { useTranslation } from "react-i18next";
import SeoExpansion from "@/components/SeoExpansion";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Estado para controlar o menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Bloquear o scroll da página quando o menu estiver aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Título, Canonical e Idioma (adapta ao idioma detectado)
  useEffect(() => {
    document.title = t('page_title');
    document.documentElement.lang = i18n.language;
    const link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (link) link.setAttribute("href", "https://www.louuz.com/");
  }, [i18n.language]);

  const handleEnterChat = (mode: 'text' | 'video') => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const guestName = `Guest${randomNum}`;
    const targetPath = mode === 'video' ? "/video" : "/text-chat";

    navigate(targetPath, { 
      state: { 
        name: guestName, 
        gender: "unspecified" 
      } 
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Efeitos de Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- HEADER COM BOTÃO DO MENU --- */}
      <div className="absolute top-0 right-0 p-6 z-[60]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/5 rounded-full h-14 w-14 transition-all relative z-50 group"
          onClick={() => setIsMenuOpen(true)}
        >
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] group-hover:drop-shadow-[0_0_16px_rgba(192,132,252,1)] group-hover:scale-110 transition-all duration-300"
          >
            <path d="M4 7H20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4 12H20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4 17H20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </Button>
      </div>

      {/* --- MENU MODAL / BOTTOM SHEET --- */}
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
              <MenuItem icon={<Home size={20} />} label={t('index.menu_home')} onClick={() => setIsMenuOpen(false)} />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <MenuItem icon={<Layers size={20} />} label={t('index.menu_rooms')} onClick={() => navigate("/rooms")} />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <MenuItem icon={<Info size={20} />} label={t('index.menu_about')} onClick={() => navigate("/about")} />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <div className="px-4 py-2 flex items-center gap-2">
                <span className="text-xs text-zinc-500 uppercase tracking-wider">{t('index.menu_lang')}</span>
                <button
                  onClick={() => { i18n.changeLanguage('pt'); setIsMenuOpen(false); }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${i18n.language === 'pt' ? 'bg-purple-500/30 text-purple-300' : 'text-zinc-400 hover:bg-white/5'}`}
                >
                  PT
                </button>
                <button
                  onClick={() => { i18n.changeLanguage('en'); setIsMenuOpen(false); }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${i18n.language === 'en' ? 'bg-purple-500/30 text-purple-300' : 'text-zinc-400 hover:bg-white/5'}`}
                >
                  EN
                </button>
              </div>
            </div>
            <div className="h-6" />
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <div className="relative flex flex-grow flex-col items-center justify-center pt-9 sm:pt-10 px-4 w-full max-w-4xl mx-auto z-10">
        
        {/* LOGO */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            lo<span className="text-cyan-400">uu</span>z
          </h1>
        </div>

        {/* HEADLINE */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-lg">
            <span className="whitespace-nowrap">{t('index.headline_1')}</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              {t('index.headline_2')}
            </span>
          </h2>
        </div>

        {/* --- VALUE PROP / ATTENTION GRABBER --- */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full hover:border-cyan-500/40 hover:bg-white/15 transition-all duration-300 group/badge">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 group-hover/badge:text-cyan-400 transition-colors" strokeWidth={2.5} />
            <span className="text-sm sm:text-base font-bold text-white">
              {t('index.value_prop')}
            </span>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-10">
          
          <Button
            onClick={() => handleEnterChat('text')}
            className="w-full h-16 sm:h-20 rounded-full bg-white text-black hover:bg-gray-100 hover:scale-[1.02] active:scale-95 transition-all duration-200 border-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center gap-3">
              <Keyboard size={28} className="text-black" strokeWidth={2.5} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{t('index.btn_text_label')}</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">{t('index.btn_text')}</span>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => handleEnterChat('video')}
            className="w-full h-16 sm:h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-200 border-0"
          >
            <div className="flex items-center gap-3">
              <Video size={28} className="text-white" strokeWidth={2.5} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-cyan-100 tracking-wider">{t('index.btn_video_label')}</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">{t('index.btn_video')}</span>
              </div>
            </div>
          </Button>

        </div>

        {/* Rodapé Legal */}
        <div className="mt-auto mb-6 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
            {t('age_warning_1')} <br />
            <button onClick={() => navigate("/terms")} className="underline hover:text-zinc-400">{t('age_warning_2')}</button>{t('age_warning_3')}
          </p>
        </div>

      </div>

      <SeoExpansion />
    </div>
  );
};

const MenuItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
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

export default Index;