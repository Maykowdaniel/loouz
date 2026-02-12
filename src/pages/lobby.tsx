import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Video, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav"; 
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const state = location.state as { name?: string; gender?: string } | null;
  const userName = state?.name || "Visitante";
  const userGender = state?.gender;

  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * (260 - 230 + 1)) + 230);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => {
        const change = Math.floor(Math.random() * 9) - 4;
        const newValue = prev + change;
        return newValue < 200 ? 205 : newValue;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gradient-bg flex h-screen flex-col pb-16">
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-glow-purple text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
            lo<span className="text-accent">uu</span>z
          </h1>
          <p className="text-xs text-muted-foreground">
            {t('lobby.welcome', { name: userName })}
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
        {/* Prova Social Dinâmica */}
        <div className="flex items-center gap-2 bg-black/40 border border-green-500/30 px-4 py-2 rounded-full shadow-lg shadow-green-900/10 backdrop-blur-md mb-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
            <span className="text-green-400 font-bold text-sm tracking-wide">
                {onlineCount.toLocaleString()} {t('connected')}
            </span>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-white mb-2">{t('lobby.title')}</h2>
          <p className="text-zinc-400 text-sm">{t('lobby.subtitle')}</p>
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
            <h3 className="text-lg font-bold text-white">{t('lobby.text_chat.title')}</h3>
            <p className="text-xs text-purple-200/70">{t('lobby.text_chat.subtitle')}</p>
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
            <h3 className="text-lg font-bold text-white">{t('lobby.video_chat.title')}</h3>
            <p className="text-xs text-pink-200/70">{t('lobby.video_chat.subtitle')}</p>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Lobby;