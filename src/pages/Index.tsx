import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, Home, Globe, CheckCircle2, X, Camera, User
  // Removi os ícones conflitantes
} from "lucide-react"; 
import SeoExpansion from "@/components/SeoExpansion";
import Footer from "@/components/Footer";
import { NICHE_PAGES } from "@/data/nichePages"; 

const PAGE_TITLE = "Louuz — Talk to Strangers | Free Omegle Alternative";

// Componente MenuItem auxiliar
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

const Index = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados Globais da Página
  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * 7000) + 80);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'text' | 'video' | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('global');

  // --- NOVOS ESTADOS (Movidos para dentro do componente) ---
  const [myGender, setMyGender] = useState<'m' | 'f'>('m'); 
  const [lookingFor, setLookingFor] = useState<'m' | 'f' | 'any'>('any'); 
  const [myAvatar, setMyAvatar] = useState<string>(""); 

  // Função de Upload de Foto (Movida para dentro do componente)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { 
        alert("Image too large (Max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setMyAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
// Função para pegar o código ISO da bandeira (br, us, de) baseado no slug
const getCountryIso = (slug: string) => {
    const map: Record<string, string> = {
        'brazil': 'br',
        'usa': 'us',
        'germany': 'de',
        'india': 'in',
        // adicione outros se precisar
    };
    return map[slug] || 'un';
};
  useEffect(() => {
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
        const change = Math.floor(Math.random() * 11) - 4; 
        const newValue = prev + change;
        return newValue < 50 ? 55 : newValue;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleInitialClick = (mode: 'text' | 'video') => {
    setPendingMode(mode);
    setIsFilterModalOpen(true);
  };

  const handleConfirmChat = () => {
    if (!pendingMode) return;
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const guestName = `Guest${randomNum}`;
    const targetPath = pendingMode === 'video' ? "/video" : "/text-chat";

    navigate(targetPath, { 
      state: { 
        name: guestName, 
        country: selectedCountry,
        gender: myGender,
        lookingFor: lookingFor,
        avatar: myAvatar 
      } 
    });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Efeitos de Fundo */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />


    {/* --- MODAL DE CONFIGURAÇÃO --- */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsFilterModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
              <h3 className="text-xl font-bold text-white">Match Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(false)}><X className="text-zinc-400" /></Button>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center gap-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your Photo (Optional)</span>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                    
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-800 ring-2 ring-white/10 overflow-hidden hover:ring-cyan-400 transition-all shadow-xl"
                    >
                        {myAvatar ? (
                            <img src={myAvatar} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-zinc-800 text-zinc-500 group-hover:text-cyan-400 transition-colors">
                                <Camera size={32} />
                                <span className="text-[10px] uppercase font-bold">Upload</span>
                            </div>
                        )}
                        {/* Overlay ao passar o mouse */}
                        {myAvatar && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={24} className="text-white" />
                            </div>
                        )}
                    </button>
                </div>

                <div className="w-full h-[1px] bg-white/5"></div>
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

                {/* 3. PAÍS (AGORA COM BANDEIRAS REAIS) */}
                <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Region</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                         {/* GLOBAL */}
                         <button onClick={() => setSelectedCountry('global')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedCountry === 'global' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                            <Globe size={24} /> 
                            <span className="text-xs font-bold">Global</span>
                         </button>

                         {/* PAÍSES COM FOTO */}
                         {NICHE_PAGES.map(niche => {
                             const iso = getCountryIso(niche.slug);
                             return (
                                 <button key={niche.slug} onClick={() => setSelectedCountry(niche.slug)} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedCountry === niche.slug ? 'bg-purple-500/10 border-purple-500 text-purple-400' : 'bg-zinc-800/50 border-white/5 text-zinc-400'}`}>
                                    {/* Imagem da Bandeira (CDN) */}
                                    <img 
                                        src={`https://flagcdn.com/w40/${iso}.png`} 
                                        alt={niche.displayName} 
                                        className="w-8 h-6 object-cover rounded-sm shadow-sm"
                                    />
                                    <span className="text-xs font-bold truncate w-full text-center">{niche.displayName}</span>
                                 </button>
                             );
                         })}
                    </div>
                </div>

            </div>
            <div className="p-6 border-t border-white/5 bg-zinc-900/50">
              <Button onClick={handleConfirmChat} className="w-full h-14 rounded-xl text-lg font-black uppercase tracking-wide bg-white text-black hover:bg-zinc-200">Start Chat</Button>
            </div>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
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
        
        {/* Contador */}
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

        {/* Botão */}
        <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-12">
          <Button onClick={() => handleInitialClick('text')} className="w-full h-16 sm:h-[80px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-200 animate-pulse-scale">
            <div className="flex items-center gap-4">
              <Video size={28} className="text-white drop-shadow-md" strokeWidth={3} />
              <div className="flex flex-col items-start leading-none text-shadow">
                <span className="text-[11px] uppercase font-bold text-cyan-100 tracking-wider mb-0.5">Fast Mode</span>
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic">START CHAT TEXT</span>
              </div>
            </div>
          </Button>
        </div>

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

export default Index;