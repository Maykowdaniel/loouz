import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  Keyboard, 
  Layers, 
  Home, 
  Globe,        // Novo
  CheckCircle2, // Novo
  X             // Novo
} from "lucide-react"; 
import SeoExpansion from "@/components/SeoExpansion";
import Footer from "@/components/Footer";
import { NICHE_PAGES } from "@/data/nichePages"; // Importando seus países

const PAGE_TITLE = "Louuz — Talk to Strangers | Free Omegle Alternative";

const Index = () => {
  const navigate = useNavigate();
  
  // Dynamic online counter state
  const [onlineCount, setOnlineCount] = useState(70);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- NOVOS ESTADOS PARA O FILTRO ---
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'text' | 'video' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('global');

  useEffect(() => {
    // Bloqueia o scroll se o Menu OU o Modal de Filtro estiverem abertos
    if (isMenuOpen || isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen, isFilterModalOpen]);

  useEffect(() => {
    document.title = PAGE_TITLE;
    document.documentElement.lang = "en";
    
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        return prev + change;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 1. O usuário clica no botão principal -> Abre o Modal
  const handleInitialClick = (mode: 'text' | 'video') => {
    setPendingMode(mode);
    setIsFilterModalOpen(true);
  };

  // 2. O usuário confirma no Modal -> Navega de verdade
  const handleConfirmChat = () => {
    if (!pendingMode) return;

    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const guestName = `Guest${randomNum}`;
    const targetPath = pendingMode === 'video' ? "/video" : "/text-chat";

    // Passamos o país escolhido no state
    navigate(targetPath, { 
      state: { 
        name: guestName, 
        gender: "unspecified",
        country: selectedCountry 
      } 
    });
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

      {/* MODAL MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-center items-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-md bg-[#18181b] border-t border-white/10 rounded-t-[30px] sm:rounded-[30px] shadow-2xl overflow-hidden p-6 animate-in slide-in-from-bottom duration-300">
             <div className="flex flex-col gap-2">
                <MenuItem icon={<Home size={20} />} label="Home" onClick={() => setIsMenuOpen(false)} />
                <MenuItem icon={<Layers size={20} />} label="Rooms" onClick={() => navigate("/rooms")} />
             </div>
          </div>
        </div>
      )}

      {/* --- NOVO: MODAL DE FILTRO DE PAÍS --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsFilterModalOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            
            {/* Header do Modal */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <div>
                <h3 className="text-xl font-bold text-white">Select Region</h3>
                <p className="text-sm text-zinc-400">Where do you want to find strangers?</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={() => setIsFilterModalOpen(false)}>
                <X className="text-zinc-400" />
              </Button>
            </div>

            {/* Lista de Países */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
              
              {/* Opção Global (Padrão) */}
              <button
                onClick={() => setSelectedCountry('global')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  selectedCountry === 'global' 
                    ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                    : 'bg-zinc-800/50 border-white/5 hover:bg-zinc-800 hover:border-white/20'
                }`}
              >
                <div className={`p-2 rounded-full ${selectedCountry === 'global' ? 'bg-cyan-500 text-black' : 'bg-zinc-700 text-zinc-400'}`}>
                  <Globe size={24} />
                </div>
                <span className={`text-sm font-bold ${selectedCountry === 'global' ? 'text-cyan-400' : 'text-zinc-300'}`}>Global</span>
                {selectedCountry === 'global' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-cyan-500" />}
              </button>

              {/* Opções dos Países (Do nichePages.ts) */}
              {NICHE_PAGES.map((niche) => (
                <button
                  key={niche.slug}
                  onClick={() => setSelectedCountry(niche.slug)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    selectedCountry === niche.slug 
                      ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                      : 'bg-zinc-800/50 border-white/5 hover:bg-zinc-800 hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow-lg">{niche.emoji}</span>
                  <span className={`text-sm font-bold truncate w-full text-center ${selectedCountry === niche.slug ? 'text-purple-400' : 'text-zinc-300'}`}>
                    {niche.displayName}
                  </span>
                  {selectedCountry === niche.slug && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-purple-500" />}
                </button>
              ))}
            </div>

            {/* Footer do Modal com Botão de Ação */}
            <div className="p-6 border-t border-white/5 bg-zinc-900/50">
              <Button 
                onClick={handleConfirmChat}
                className={`w-full h-14 rounded-xl text-lg font-black uppercase tracking-wide shadow-lg transition-all ${
                  pendingMode === 'video' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-cyan-500/25' 
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                Start {pendingMode === 'video' ? 'Video' : 'Text'} Chat
              </Button>
            </div>

          </div>
        </div>
      )}


      {/* --- HERO SECTION --- */}
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
            TALK TO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">
              STRANGERS
            </span>
          </h2>
        </div>

       {/* --- CONTADOR (Design Atualizado que você mandou) --- */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 px-8 py-4 rounded-2xl flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                {/* Ícone Pulsante */}
                <div className="relative flex items-center justify-center mb-3">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,1)] z-10 animate-pulse"></div>
                    <div className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75 scale-150"></div>
                </div>
                {/* Número Gigante */}
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    {onlineCount.toLocaleString()}
                </span>
                {/* Counter Label */}
                <span className="text-emerald-400 font-bold text-sm sm:text-base uppercase tracking-[0.2em] mt-1">
                    Online Users
                </span>
            </div>
        </div>

        {/* --- BOTÕES (Atualizados para abrir o Modal) --- */}
        <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-12">

          <Button
            onClick={() => handleInitialClick('video')} // <--- Alterado aqui
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
            onClick={() => handleInitialClick('text')} // <--- Alterado aqui
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

        {/* Legal Footer (O que você queria manter) */}
        <div className="mt-auto mb-6 text-center animate-in fade-in duration-1000 delay-500 opacity-50 hover:opacity-100 transition-opacity">
          <p className="text-[11px] text-zinc-400">
            You must be 18+ to use Louuz.{" "}
            <button onClick={() => navigate("/terms")} className="underline hover:text-white transition-colors">Read the terms</button>{" "}before continuing.
          </p>
        </div>

      </div>

      <SeoExpansion />
      <Footer />
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