import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Globe, 
  Coffee, 
  Flame, 
  Bitcoin, 
  Mic, 
  HeartCrack, 
  Ghost, 
  LogOut, 
  Lock
} from "lucide-react";

// Definição das salas baseada na sua imagem
const rooms = [
  {
    id: "global",
    name: "Bate-papo Vooz",
    description: "Sala de bate-papo global",
    icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    id: "area51",
    name: "Área 51",
    description: "Zona de discussão ultrassecreta",
    icon: Ghost, // Simulando o Alien
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    id: "cafe",
    name: "Café VOOZ",
    description: "Ambiente descontraído, conversas informais.",
    icon: Coffee,
    color: "text-amber-700",
    bg: "bg-amber-700/10",
  },
  {
    id: "off",
    name: "Extraoficialmente",
    description: "Sem filtros, sem edição, totalmente confidencial.",
    icon: Lock,
    color: "text-gray-400",
    bg: "bg-gray-400/10",
  },
  {
    id: "roast",
    name: "A sala de assados",
    description: "Sem restrições, critique ou seja criticado.",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    id: "crypto",
    name: "A trincheira criptográfica",
    description: "Análises aprofundadas e mundo das criptomoedas.",
    icon: Bitcoin,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: "mic",
    name: "Solta o microfone",
    description: "Diga o que tem a dizer e vá embora.",
    icon: Mic,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    id: "heartbreak",
    name: "Conexões perdidas",
    description: "Para aqueles que quase foram.",
    icon: HeartCrack,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
];

const Lobby = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = (location.state as { name?: string })?.name || "Visitante";
  const userGender = (location.state as { gender?: string })?.gender;

  const handleJoinRoom = (room: typeof rooms[0]) => {
    navigate("/chat", { 
      state: { 
        name: userName, 
        gender: userGender,
        roomName: room.name,
        roomId: room.id 
      } 
    });
  };

  return (
    <div className="gradient-bg flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-glow-purple text-2xl font-bold tracking-tight">
            Salas <span className="text-accent">Disponíveis</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Logado como <span className="text-foreground font-medium">{userName}</span>
          </p>
        </div>
        <Button
          onClick={() => navigate("/")}
          variant="ghost"
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </header>

      {/* Lista de Salas */}
      <ScrollArea className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-3">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              onClick={() => handleJoinRoom(room)}
              className="group animate-fade-in-up flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:scale-[1.01] hover:bg-card/80 hover:box-glow-purple hover:border-primary/50"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Ícone da sala */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${room.bg} ${room.color} ring-1 ring-white/5 transition-transform group-hover:scale-110`}>
                <room.icon className="h-6 w-6" />
              </div>

              {/* Textos */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {room.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {room.description}
                </p>
              </div>

              {/* Indicador de entrar */}
              <div className="hidden text-xs font-medium text-accent opacity-0 transition-all sm:block group-hover:opacity-100 group-hover:translate-x-[-10px]">
                Entrar →
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Lobby;