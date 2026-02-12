import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Globe, Flame, TrendingUp, Zap, BookOpen, Ghost, Heart } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useTranslation } from "react-i18next";
import ChatMessage from "@/components/ChatMessage";

// --- DADOS DAS SALAS (Cópia exata de Rooms.tsx) ---
const roomsData = [
  { id: "global", nameKey: "rooms.list.global.name", descKey: "rooms.list.global.desc", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "trending", nameKey: "rooms.list.trending.name", descKey: "rooms.list.trending.desc", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "money", nameKey: "rooms.list.money.name", descKey: "rooms.list.money.desc", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "nofilter", nameKey: "rooms.list.nofilter.name", descKey: "rooms.list.nofilter.desc", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "stories", nameKey: "rooms.list.stories.name", descKey: "rooms.list.stories.desc", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-400/10" },
  { id: "area51", nameKey: "rooms.list.area51.name", descKey: "rooms.list.area51.desc", icon: Ghost, color: "text-zinc-400", bg: "bg-zinc-400/10" },
  { id: "love", nameKey: "rooms.list.love.name", descKey: "rooms.list.love.desc", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

// --- VISUALIZAÇÃO DO CHAT DA SALA (Idêntico ao Chat.tsx) ---
const RoomChatView = ({ roomId, roomName, username, onBack }: { roomId: string, roomName: string, username: string, onBack: () => void }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [userCount, setUserCount] = useState(1);
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.on("connect", () => {
            socketRef.current?.emit("join_room", { room: roomId, username, gender: "unspecified" });
        });
        socketRef.current.on("receive_message", (msg: any) => {
            const isMe = msg.senderName === username && msg.sender !== "system";
            const newMessage = {
                ...msg,
                sender: msg.sender === "system" ? "system" : (isMe ? "user" : "stranger"),
                id: msg.id || crypto.randomUUID()
            };
            setMessages((prev) => [...prev.slice(-49), newMessage]);
        });
        socketRef.current.on("room_meta", (data: { count: number }) => {
            setUserCount(data.count);
        });
        return () => { socketRef.current?.disconnect(); };
    }, [roomId, username]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        socketRef.current?.emit("send_message", { room: roomId, senderName: username, text: input, id: crypto.randomUUID() });
        setInput("");
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950/50">
            <div className="flex items-center gap-3 p-4 border-b border-border bg-card/60 backdrop-blur-sm h-[72px]">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h3 className="font-bold text-base text-foreground">{roomName}</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] text-muted-foreground">{userCount} online</span>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-4 py-4">
                <div className="space-y-3">
                    {messages.map((msg, i) => (
                        <ChatMessage
                            key={i}
                            sender={msg.sender}
                            text={msg.text}
                            senderName={msg.senderName}
                            senderCountry={msg.senderCountry}
                            senderGender={msg.senderGender}
                        />
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card/60 flex gap-2">
                <Input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Conversar em ${roomName}...`} 
                    className="h-10 bg-background/50 border-border focus-visible:ring-primary" 
                />
                <Button size="icon" className="h-10 w-10 gradient-btn border-0" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: LISTA DE SALAS (Visual do Rooms.tsx) ---
const SidePanel = ({ username }: { username: string }) => {
    const { t } = useTranslation();
    const [activeRoom, setActiveRoom] = useState<{ id: string, name: string } | null>(null);

    if (activeRoom) {
        return <RoomChatView roomId={activeRoom.id} roomName={activeRoom.name} username={username} onBack={() => setActiveRoom(null)} />;
    }

    return (
        <div className="flex flex-col h-full bg-zinc-950/50 border-l border-zinc-800">
            {/* Header da Lista - Altura fixa para alinhar com o header da esquerda */}
            <div className="p-4 border-b border-zinc-800 bg-card/40 h-[72px] flex items-center">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <Globe size={18} className="text-purple-500" /> 
                    {t('rooms.title') || "Salas Globais"}
                </h3>
            </div>
            
            {/* Lista de Salas - SEM espaçamento extra na esquerda (removido padding excessivo do ScrollArea e usando o do item) */}
            <ScrollArea className="flex-1 p-0"> 
                <div className="space-y-3 p-4"> {/* Padding uniforme ao redor dos itens */}
                    {roomsData.map((room) => (
                        <div 
                            key={room.id}
                            onClick={() => setActiveRoom({ id: room.id, name: t(room.nameKey) })}
                            // ✅ ESTILO ORIGINAL DO ROOMS.TSX (P-4, GAP-4, ÍCONES MAIORES)
                            className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:scale-[1.01] hover:bg-card/80 hover:box-glow-purple hover:border-primary/50"
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
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default SidePanel;