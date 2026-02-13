import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Keyboard, 
  Layers, 
  Home, 
  Coins, 
  ShoppingBag, 
  Bell, 
  Settings, 
  Info,
  X 
} from "lucide-react"; 
import { useTranslation } from "react-i18next";
import SeoExpansion from "@/components/SeoExpansion";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Estado para o contador fake
  const [onlineCount, setOnlineCount] = useState(1385);
  
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

  // Lógica do contador
  useEffect(() => {
    document.title = "Louuz - Converse com Estranhos"; 
    document.documentElement.lang = i18n.language;

    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 9) - 4; 
        const next = prev + change;
        return next < 500 ? 500 : next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [t, i18n.language]);

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

        {/* --- CONTADOR MODIFICADO (MAIS CHAMATIVO) --- */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
            {/* Container com fundo sutil para destacar */}
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 px-8 py-4 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                
                {/* Ícone Pulsante (Maior) */}
                <div className="relative flex items-center justify-center mb-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] z-10 animate-pulse"></div>
                    <div className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75 scale-150"></div>
                </div>
                
                {/* Número Gigante */}
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    {onlineCount.toLocaleString()}
                </span>
                
                {/* Texto Descritivo */}
                <span className="text-emerald-400 font-bold text-sm sm:text-base uppercase tracking-[0.2em] mt-1">
                    Pessoas Online
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