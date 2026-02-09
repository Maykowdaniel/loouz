import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Video, LogOut } from "lucide-react";
import BottomNav from "@/components/BottomNav"; 
import { useTranslation } from "react-i18next";

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const state = location.state as { name?: string; gender?: string } | null;
  const userName = state?.name || "Visitante";
  const userGender = state?.gender;

  return (
    <div className="gradient-bg flex h-screen flex-col pb-16">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-glow-purple text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
          lo<span className="text-accent">uu</span>z
        </h1>
          <p className="text-xs text-muted-foreground">
            Olá, <span className="text-foreground font-medium">{userName}</span>
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
        </Button>
      </header>

      {/* Conteúdo Principal: Escolha do Modo */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 animate-fade-in-up">
        
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
          <p className="text-zinc-400 text-sm">{t('connect')}</p>
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
            <h3 className="text-lg font-bold text-white">{t('text_chat_op')}</h3>
            <p className="text-xs text-purple-200/70">{t('tipe_text')}</p>
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
            <h3 className="text-lg font-bold text-white">{t('text_video_op')}</h3>
            <p className="text-xs text-pink-200/70">{t('tipe_video')}</p>
          </div>
        </button>

      </div>

      {/* Barra de Navegação */}
      <BottomNav />
    </div>
  );
};

export default Lobby;