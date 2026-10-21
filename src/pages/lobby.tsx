import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Video, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav"; 
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Ajuste a URL do servidor se necessário (ex: "http://localhost:3001" para testes locais)
const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { name?: string; gender?: string } | null;
  const userName = state?.name || "Guest";
  const userGender = state?.gender;

  // Estado do número real de usuários online
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Conecta ao servidor para escutar o evento real de conexões
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("global_online_count", (data: { count: number }) => {
      setOnlineCount(data.count);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="gradient-bg flex h-screen flex-col pb-16">
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-glow-purple text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
            lo<span className="text-accent">uu</span>z
          </h1>
          <p className="text-xs text-muted-foreground">
            Hello, {userName}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 animate-fade-in-up">
        {/* Prova Social Dinâmica - Número real em tempo real */}
        <div className="flex items-center gap-2 bg-black/40 border border-green-500/30 px-4 py-2 rounded-full shadow-lg shadow-green-900/10 backdrop-blur-md mb-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-green-400 font-bold text-sm tracking-wide">
                {onlineCount.toLocaleString()} Online
            </span>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">Meet someone new</h2>
          <p className="text-zinc-400 text-sm">Choose how you want to connect.</p>
        </div>

        {/* Botão Texto 1v1 */}
        <button
          onClick={() => navigate("/text-chat", { state: { name: userName, gender: userGender } })}
          className="group w-full max-w-sm flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 hover:border-purple-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <div className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500 text-purple-400 group-hover:text-white transition-colors">
            <MessageCircle size={28} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">Text Chat</h3>
            <p className="text-xs text-purple-200/70">Random • 1v1</p>
          </div>
        </button>

        {/* Botão Vídeo 1v1 */}
        <button
          onClick={() => navigate("/video", { state: { name: userName, gender: userGender } })}
          className="group w-full max-w-sm flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-pink-900/50 to-rose-900/50 border border-pink-500/30 hover:border-pink-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20"
        >
          <div className="h-14 w-14 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500 text-pink-400 group-hover:text-white transition-colors">
            <Video size={28} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">Video Chat</h3>
            <p className="text-xs text-pink-200/70">Camera On • 1v1</p>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Lobby;