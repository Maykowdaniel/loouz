import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Keyboard, 
  Layers, 
  Home, 
  Info 
} from "lucide-react"; 
import { useTranslation } from "react-i18next";
import SeoExpansion from "@/components/SeoExpansion";

const Index = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
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

  // Título e Idioma
  useEffect(() => {
    document.title = "Louuz - Converse com Estranhos"; 
    document.documentElement.lang = i18n.language;
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
            className="drop-shadow-[0_0_5px_rgba(192,132,252,0.6)] group-hover:drop-shadow-[0_0_10px_rgba(192,132,252,1)] transition-all duration-300"
          >
            <path d="M4 7H20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round"/>
            <path d="M4 12H20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round"/>
            <path d="M12 17H20" stroke="#C084FC" strokeWidth="3" strokeLinecap="round"/>
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
              <MenuItem icon={<Home size={20} />} label="Home" onClick={() => setIsMenuOpen(false)} />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <MenuItem icon={<Layers size={20} />} label="Salas (Rooms)" onClick={() => navigate("/rooms")} />
              <div className="h-px bg-zinc-800 my-1 mx-4" />
              <MenuItem icon={<Info size={20} />} label="Sobre" onClick={() => navigate("/about")} />
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
            <span className="whitespace-nowrap">Converse com</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              Estranhos
            </span>
          </h2>
        </div>

        {/* --- DISCORD BUTTON (SUBSTITUIU O CONTADOR) --- */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
            <a 
              href="https://discord.gg/YJCctkH5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative bg-[#5865F2]/10 backdrop-blur-md border border-[#5865F2]/50 px-10 py-6 rounded-3xl flex flex-col items-center shadow-[0_0_40px_rgba(88,101,242,0.3)] hover:shadow-[0_0_60px_rgba(88,101,242,0.6)] hover:bg-[#5865F2]/20 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
                {/* Efeito de Ping no Fundo (Atenção) */}
                <div className="absolute inset-0 bg-[#5865F2] rounded-3xl animate-pulse opacity-10 blur-xl group-hover:opacity-20 transition-opacity"></div>
                
                {/* Ícone Discord Gigante */}
                <div className="relative z-10 mb-2 drop-shadow-[0_0_15px_rgba(88,101,242,0.8)]">
                  <svg width="60" height="60" viewBox="0 0 127 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 sm:w-20 sm:h-20 text-white fill-white">
                    <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.25 8.09C2.79 32.65-1.71 56.6.54 80.21a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2.03a75.4 75.4 0 0 0 62.18 0c.87.69 1.76 1.37 2.65 2.03a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1 105.25 105.25 0 0 0 32.19-16.15c2.6-25.6-5.98-48.16-16.7-72.15ZM42.45 65.69C36.18 65.69 31 60.08 31 53.23c0-6.85 5.1-12.46 11.45-12.46 6.34 0 11.54 5.61 11.45 12.46 0 6.85-5.1 12.46-11.45 12.46Zm42.51 0c-6.27 0-11.46-5.61-11.46-12.46 0-6.85 5.1-12.46 11.46-12.46 6.35 0 11.55 5.61 11.45 12.46 0 6.85-5.1 12.46-11.45 12.46Z"/>
                  </svg>
                </div>
                
                {/* Texto Chamada */}
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-lg group-hover:text-[#5865F2] transition-colors">
                    Entrar no Discord
                </span>
                
                {/* Subtexto */}
                <span className="text-[#5865F2] font-bold text-xs sm:text-sm uppercase tracking-[0.2em] mt-2 bg-white/10 px-3 py-1 rounded-full">
                    Comunidade Oficial
                </span>
            </a>
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
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Modo Rápido</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">Iniciar Chat de Texto</span>
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
                <span className="text-[10px] uppercase font-bold text-cyan-100 tracking-wider">Câmera Ligada</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">Iniciar Vídeo Chat</span>
              </div>
            </div>
          </Button>

        </div>

        {/* Rodapé Legal */}
        <div className="mt-auto mb-6 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
            Você precisa ter 18 anos ou mais para usar o Louuz. <br />
            <button onClick={() => navigate("/terms")} className="underline hover:text-zinc-400">Leia os termos</button> antes de continuar.
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