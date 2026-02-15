import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button"; 
import { 
  Globe, Ghost, Heart, LogOut, 
  Flame, TrendingUp, Zap, BookOpen 
} from "lucide-react";

const roomsData = [
  { id: "global", name: "Global Chat", desc: "Talk to everyone.", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "trending", name: "Trending Topics", desc: "What's viral right now. 🔥", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "money", name: "Investments & Crypto", desc: "Crypto, stocks, and business talk. 💸", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "nofilter", name: "No Filter / Uncensored", desc: "Free speech and hot takes. ⚡", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "stories", name: "Real Stories", desc: "Confessions and life experiences. 📖", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-400/10" },
  { id: "area51", name: "Area 51 / Mystery", desc: "Top secret discussions.", icon: Ghost, color: "text-zinc-400", bg: "bg-zinc-400/10" },
  { id: "love", name: "Love", desc: "Dating, flirting and connections. ❤️", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const Rooms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as { name?: string; gender?: string } | null;
  const [userData] = useState({
      name: state?.name || `Guest${Math.floor(Math.random() * 90000) + 10000}`,
      gender: state?.gender || "unspecified"
  });

  const handleJoinRoom = (room: typeof roomsData[0]) => {
    navigate("/chat", { 
      state: { 
        name: userData.name, 
        gender: userData.gender,
        roomName: room.name,
        roomId: room.id 
      } 
    });
  };

  return (
    // ✅ Removido 'pb-16' pois não temos mais BottomNav
    <div className="gradient-bg flex h-screen flex-col">
      
      {/* 1. APP BAR */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-glow-purple text-3xl font-black tracking-tighter sm:text-4xl md:text-5xl">
            lo<span className="text-accent">uu</span>z
          </h1>
          <p className="text-xs text-muted-foreground">
            Hello, {userData.name}
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">
          PUBLIC ROOMS
        </h2>
        <p className="text-xs text-zinc-400">
          Choose a topic and join the conversation
        </p>
      </div>

      {/* Lista de Salas */}
      <ScrollArea className="flex-1 px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3 pb-8">
          {roomsData.map((room, index) => (
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
                  {room.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {room.desc}
                </p>
              </div>

              <div className="hidden text-xs font-medium text-accent opacity-0 transition-all sm:block group-hover:opacity-100 group-hover:translate-x-[-10px]">
                →
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* ✅ BOTTOM NAV REMOVIDA DAQUI */}
    </div>
  );
};

export default Rooms;