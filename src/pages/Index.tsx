import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Video, MessageSquare, X, Mail, CheckCircle2 
} from "lucide-react"; 
import SeoExpansion from "@/components/SeoExpansion";
import Footer from "@/components/Footer";
import { io, Socket } from "socket.io-client";

const PAGE_TITLE = "Louuz — Talk to Strangers | Free Omegle Alternative";
// Mude para o seu servidor remoto ou local conforme os testes:
//const SOCKET_URL = "http://localhost:3001"; 
const SOCKET_URL = "https://loouz-oficial-final.onrender.com";
const Index = () => {
  const navigate = useNavigate();
  
  // Estados Globais da Página
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const socketRef = useRef<Socket | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<'text' | 'video' | null>(null);

  // Estados do usuário para filtros (Apenas Gênero)
  const [myGender, setMyGender] = useState<'m' | 'f'>('m'); 
  const [lookingFor, setLookingFor] = useState<'m' | 'f' | 'any'>('any'); 
  
  // Estados para e-mail de notificação de horário de pico
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailRegistered, setEmailRegistered] = useState<boolean>(false);

  useEffect(() => {
    if (isMenuOpen || isFilterModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen, isFilterModalOpen]);

  // Conexão do Socket para obter a contagem real
  useEffect(() => {
    document.title = PAGE_TITLE;
    document.documentElement.lang = "en";

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("global_online_count", (data: { count: number }) => {
      setOnlineCount(data.count);
    });

    return () => {
      socketRef.current?.disconnect();
    };
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
        country: "global",
        gender: myGender,
        lookingFor: lookingFor,
        from: window.location.pathname
      } 
    });
  };

  const handleRegisterNotificationEmail = () => {
    if (userEmail && userEmail.includes("@")) {
      socketRef.current?.emit("register_notification_email", { email: userEmail });
      setEmailRegistered(true);
    } else {
      alert("Please enter a valid email address.");
    }
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
              <Button variant="ghost" size="icon" onClick={() => setIsFilterModalOpen(false)}>
                <X className="text-zinc-400" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
                {/* 1. SELEÇÃO DE GÊNERO (EU SOU) */}
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
        
        {/* CONTADOR EM TEMPO REAL */}
        <div className="flex flex-col items-center justify-center mb-10 animate-in fade-in zoom-in duration-700 delay-200">
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

        {/* BOTÕES DE AÇÃO (VÍDEO E TEXTO) */}
        <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300 pb-12">
          
          {/* BOTÃO 1: CHAT DE VÍDEO */}
          <Button 
            onClick={() => handleInitialClick('video')} 
            className="w-full h-16 sm:h-[76px] rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] active:scale-95 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Video size={28} className="text-white drop-shadow-md" strokeWidth={3} />
              <div className="flex flex-col items-start leading-none text-shadow">
                <span className="text-[11px] uppercase font-bold text-cyan-100 tracking-wider mb-0.5">Cam On</span>
                <span className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic">START VIDEO CHAT</span>
              </div>
            </div>
          </Button>

          {/* BOTÃO 2: CHAT DE TEXTO */}
          <Button 
            onClick={() => handleInitialClick('text')} 
            className="w-full h-16 sm:h-[72px] rounded-full bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all duration-200 border-0 shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <MessageSquare size={26} className="text-black group-hover:text-cyan-600 transition-colors" strokeWidth={2.5} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5">Fast Mode</span>
                <span className="text-xl sm:text-2xl font-black uppercase tracking-tight">START TEXT CHAT</span>
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