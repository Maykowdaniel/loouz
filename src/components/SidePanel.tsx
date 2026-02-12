import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Globe, Flame, TrendingUp, Zap, BookOpen, Ghost, Heart } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// --- DADOS DAS SALAS (Mesmo do Rooms.tsx) ---
const roomsData = [
  { id: "global", nameKey: "rooms.list.global.name", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "trending", nameKey: "rooms.list.trending.name", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "money", nameKey: "rooms.list.money.name", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "nofilter", nameKey: "rooms.list.nofilter.name", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "stories", nameKey: "rooms.list.stories.name", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-400/10" },
  { id: "area51", nameKey: "rooms.list.area51.name", icon: Ghost, color: "text-zinc-400", bg: "bg-zinc-400/10" },
  { id: "love", nameKey: "rooms.list.love.name", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

// --- SUB-COMPONENTE: CHAT DA SALA ---
const RoomChatView = ({ roomId, roomName, username, onBack }: { roomId: string, roomName: string, username: string, onBack: () => void }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.on("connect", () => {
            socketRef.current?.emit("join_room", { room: roomId, username, gender: "unspecified" });
        });
        socketRef.current.on("receive_message", (msg: any) => {
            setMessages((prev) => [...prev.slice(-49), msg]);
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
        <div className="flex flex-col h-full bg-zinc-900">
            {/* Header da Sala */}
            <div className="flex items-center gap-2 p-3 border-b border-zinc-800 bg-zinc-950/50">
                <Button variant="ghost" size="icon" onClick={onBack} className="h-6 w-6 text-zinc-400 hover:text-white">
                    <ArrowLeft size={16} />
                </Button>
                <span className="font-bold text-sm text-zinc-200">{roomName}</span>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-3">
                <div className="space-y-2">
                    {messages.map((msg, i) => (
                        <div key={i} className={`text-sm ${msg.sender === "system" ? "text-yellow-500 italic" : "text-zinc-300"}`}>
                             <span className={`font-bold ${msg.senderName === username ? "text-purple-400" : "text-zinc-500"}`}>
                                {msg.senderName}: 
                             </span> 
                             <span className="ml-1 text-white">{msg.text}</span>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-2 border-t border-zinc-800 bg-zinc-950/30 flex gap-2">
                <Input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Conversar em ${roomName}...`} 
                    className="h-8 text-xs bg-zinc-800 border-none" 
                />
                <Button size="icon" className="h-8 w-8 bg-purple-600 hover:bg-purple-700" onClick={handleSend}>
                    <Send className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL: PAINEL LATERAL ---
const SidePanel = ({ username }: { username: string }) => {
    const { t } = useTranslation();
    const [activeRoom, setActiveRoom] = useState<{ id: string, name: string } | null>(null);

    // Se tiver uma sala ativa, mostra o Chat. Senão, mostra a Lista.
    if (activeRoom) {
        return <RoomChatView 
            roomId={activeRoom.id} 
            roomName={activeRoom.name} 
            username={username} 
            onBack={() => setActiveRoom(null)} 
        />;
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
            <div className="p-4 border-b border-zinc-800">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Salas Globais</h3>
                <p className="text-xs text-zinc-500">Escolha uma sala para conversar</p>
            </div>
            
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-2">
                    {roomsData.map((room) => (
                        <div 
                            key={room.id}
                            onClick={() => setActiveRoom({ id: room.id, name: t(room.nameKey) })}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-all group"
                        >
                            <div className={`p-2 rounded-full ${room.bg} ${room.color}`}>
                                <room.icon size={16} />
                            </div>
                            <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                {t(room.nameKey)}
                            </span>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default SidePanel;