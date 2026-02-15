import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Keyboard, 
  Layers, 
  Home, 
  Zap, // Voltando com o ícone de Raio original
} from "lucide-react"; 
import { useTranslation } from "react-i18next";
import SeoExpansion from "@/components/SeoExpansion";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Estado para o contador fake (Começa igual ao print)
  const [onlineCount, setOnlineCount] = useState(1384);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Lógica do contador (Sutil e Dinâmico)
  useEffect(() => {
    document.title = t('page_title');
    document.documentElement.lang = i18n.language;
    
    // Atualiza o contador a cada 4 segundos para parecer orgânico
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // Varia pouco (-3 a +3)
        return prev + change;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [t, i18n.language]);

  const handleEnterChat = (mode: 'text' | 'video') => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const guestName = `Guest${randomNum}`;
    const targetPath = mode === 'video' ? "/video" : "/text-chat";

    navigate(targetPath, { state: { name: guestName, gender: "unspecified" } });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Efeitos de Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- MENU --- */}
      <div className="absolute top-0 right-0 p-6 z-[60]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-white/5 rounded-full h-14 w-14 transition-all"
          onClick={() => setIsMenuOpen(true)}
        >
          <div className="flex flex-col gap-[6px] items-end group">
            <div className="w-8 h-[2px] bg-purple-400 rounded-full group-hover:w-6 transition-all"></div>
            <div className="w-6 h-[2px] bg-purple-400 rounded-full group-hover:w-8 transition-all"></div>
            <div className="w-4 h-[2px] bg-purple-400 rounded-full group-hover:w-6 transition-all"></div>
          </div>
        </Button>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-md bg-[#18181b] border-t border-white/10 rounded-t-[30px] sm:rounded-[30px] shadow-2xl overflow-hidden p-6 animate-in slide-in-from-bottom duration-300">
             <div className="flex flex-col gap-2">
                <MenuItem icon={<Home size={20} />} label={t('index.menu_home')} onClick={() => setIsMenuOpen(false)} />
                <MenuItem icon={<Layers size={20} />} label={t('index.menu_rooms')} onClick={() => navigate("/rooms")} />
                <div className="border-t border-white/10 my-2"></div>
                <div className="flex gap-4 justify-center pt-2">
                    <button onClick={() => i18n.changeLanguage('pt')} className={`text-sm font-bold ${i18n.language === 'pt' ? 'text-cyan-400' : 'text-zinc-500'}`}>PT-BR</button>
                    <button onClick={() => i18n.changeLanguage('en')} className={`text-sm font-bold ${i18n.language === 'en' ? 'text-cyan-400' : 'text-zinc-500'}`}>ENGLISH</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- HERO --- */}
      <div className="relative flex flex-grow flex-col items-center justify-center pt-10 px-4 w-full max-w-4xl mx-auto z-10">
        
        {/* LOGO */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            lo<span className="text-cyan-400">uu</span>z
          </h1>
        </div>

        {/* HEADLINE */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <h2 className="text-5xl sm:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-lg">
            CONVERSE COM<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              ESTRANHOS
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
        <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-12">


          <Button
            onClick={() => handleEnterChat('video')}
            className="w-full h-16 sm:h-[80px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-200 animate-pulse-scale"
          >
            <div className="flex items-center gap-4">
              <Video size={28} className="text-white drop-shadow-md" strokeWidth={3} />
              <div className="flex flex-col items-start leading-none text-shadow">
                <span className="text-[11px] uppercase font-bold text-cyan-100 tracking-wider mb-0.5">Câmera Ligada</span>
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic">Vídeo Chat</span>
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
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">Modo Rápido</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">Chat de Texto</span>
              </div>
            </div>
          </Button>

          {/* BOTÃO COM ANIMAÇÃO DE PULSO (Igual ao seu pedido) */}

        </div>

        {/* Rodapé Legal */}
        <div className="mt-auto mb-6 text-center animate-in fade-in duration-1000 delay-500 opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-[11px] text-zinc-400">
            {t('age_warning_1')} <br />
            <button onClick={() => navigate("/terms")} className="underline hover:text-white transition-colors">{t('age_warning_2')}</button>{t('age_warning_3')}
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
    className="w-full flex items-center gap-4 px-4 py-4 text-zinc-400 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
  >
    <div className="text-zinc-600 group-hover:text-cyan-400 transition-colors">
      {icon}
    </div>
    <span className="text-lg font-bold tracking-tight">{label}</span>
  </button>
);

export default Index;