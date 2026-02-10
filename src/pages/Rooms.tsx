import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; 
import { useTranslation } from "react-i18next";
import BottomNav from "@/components/BottomNav";
import { 
  Globe, Ghost, Heart, LogOut, 
  Flame, TrendingUp, Zap, BookOpen // <--- NOVOS ÍCONES
} from "lucide-react";

const rooms = [
  {
    id: "global",
    nameKey: "aaaaaa",
    descKey: "desc_global",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "trending",
    nameKey: "room_trending",
    descKey: "desc_trending",
    icon: Flame, 
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "money",
    nameKey: "room_invest",
    descKey: "desc_invest",
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10", 
  },
  {
    id: "nofilter",
    nameKey: "room_nofilter",
    descKey: "desc_nofilter",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10", 
  },
  {
    id: "stories",
    nameKey: "room_stories",
    descKey: "desc_stories",
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-400/10", 
  },
  {
    id: "area51",
    nameKey: "room_area51",
    descKey: "desc_area51",
    icon: Ghost, 
    color: "text-zinc-400", // Mudei para cinza para ficar "misterioso"
    bg: "bg-zinc-400/10",
  },
  {
    id: "love",
    nameKey: "room_love",
    descKey: "desc_love",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-500/10", 
  },
];

const Rooms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const state = location.state as { name?: string; gender?: string } | null;
  const userName = state?.name || "Visitante";
  const userGender = state?.gender;

  const handleJoinRoom = (room: typeof rooms[0]) => {
    navigate("/chat", { 
      state: { 
        name: userName, 
        gender: userGender,
        roomName: t(room.nameKey),
        roomId: room.id 
      } 
    });
  };

  return (
    <div className="gradient-bg flex h-screen flex-col pb-16">
      
      {/* 1. APP BAR */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-glow-purple text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
          lo<span className="text-accent">uu</span>z
        </h1>
          <p className="text-xs text-muted-foreground">
            Hello, <span className="text-foreground font-medium">{userName}</span>
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

      {/* 2. TÍTULO */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-bold text-white">
          public rooms
        </h2>
        <p className="text-xs text-zinc-400">
          Choose a topic and join the conversation
        </p>
      </div>

      {/* Lista de Salas */}
      <ScrollArea className="flex-1 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3 pb-8">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              onClick={() => handleJoinRoom(room)}
              className="group animate-fade-in-up flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:scale-[1.01] hover:bg-card/80 hover:box-glow-purple hover:border-primary/50"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${room.bg} ${room.color} ring-1 ring-white/5 transition-transform group-hover:scale-110`}>
                <room.icon className="h-6 w-6" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(room.nameKey)} 
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {t(room.descKey)}
                </p>
              </div>

              <div className="hidden text-xs font-medium text-accent opacity-0 transition-all sm:block group-hover:opacity-100 group-hover:translate-x-[-10px]">
                →
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <BottomNav />
    </div>
  );
};

export default Rooms;