import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Keyboard, MoreVertical, Layers } from "lucide-react"; // Adicionei Keyboard
import { useTranslation } from "react-i18next";
import SeoExpansion from "@/components/SeoExpansion";

const Index = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Estado para o contador fake
  const [onlineCount, setOnlineCount] = useState(1382); // Começa próximo ao print
  
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

  // Função para entrar direto
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
    // Fundo escuro com gradientes ambientais para dar o clima "Noturno/App"
    <div className="relative flex flex-col min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Efeitos de Fundo (Blobs de cor) */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* --- HEADER COM MENU (MANTIDO) --- */}
      <div className="absolute top-0 right-0 p-6 z-50">
        <div className="relative" ref={menuRef}>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10 rounded-full h-12 w-12 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={28} />
          </Button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
              <button 
                onClick={() => navigate("/rooms")}
                className="w-full text-left px-4 py-3 text-white hover:bg-zinc-800 flex items-center gap-3 transition-colors"
              >
                <Layers size={18} className="text-cyan-400" />
                <span className="font-medium">Salas (Rooms)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- HERO SECTION CENTRALIZADA --- */}
      <div className="relative flex flex-grow flex-col items-center justify-center px-4 w-full max-w-lg mx-auto z-10">
        
        {/* 1. LOGO */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl">
            lo<span className="text-cyan-400">uu</span>z
          </h1>
        </div>

        {/* 2. HEADLINE "CONVERSE COM ESTRANHOS" */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-lg">
            Converse <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              Com Estranhos
            </span>
          </h2>
        </div>

        {/* 3. CONTADOR DE PESSOAS ONLINE (ESTILO LED) */}
        <div className="flex flex-col items-center justify-center mb-12 animate-in fade-in zoom-in duration-700 delay-200">
          {/* Bola verde brilhante */}
          <div className="relative flex items-center justify-center mb-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.8)] z-10 animate-pulse"></div>
            <div className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
          
          {/* Texto do contador */}
          <p className="text-emerald-400 font-bold text-xl sm:text-2xl uppercase tracking-wider text-center drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            {onlineCount.toLocaleString()} Pessoas <br/>
            <span className="text-emerald-500/80 text-sm sm:text-base">Online Agora</span>
          </p>
        </div>

        {/* 4. BOTÕES DE AÇÃO (FULL WIDTH MOBILE) */}
        <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          
          {/* Botão TEXTO: Branco, Ícone Preto */}
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

          {/* Botão VÍDEO: Gradiente Azul/Ciano */}
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
        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500">
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

export default Index;