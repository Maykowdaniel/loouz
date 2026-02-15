import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Globe, Flame, TrendingUp, Zap, BookOpen, Ghost, Heart, Users } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage";

const roomsData = [
  { id: "global", name: "Global Chat", desc: "Talk to everyone.", icon: Globe, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "trending", name: "Trending Topics", desc: "What's viral right now. 🔥", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "money", name: "Investments & Crypto", desc: "Crypto, stocks, and business talk. 💸", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "nofilter", name: "No Filter / Uncensored", desc: "Free speech and hot takes. ⚡", icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { id: "stories", name: "Real Stories", desc: "Confessions and life experiences. 📖", icon: BookOpen, color: "text-violet-400", bg: "bg-violet-400/10" },
  { id: "area51", name: "Area 51 / Mystery", desc: "Top secret discussions.", icon: Ghost, color: "text-zinc-400", bg: "bg-zinc-400/10" },
  { id: "love", name: "Love", desc: "Dating, flirting and connections. ❤️", icon: Heart, color: "text-pink-500", bg: "bg-pink-500/10" },
];

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const RoomChatView = ({ roomId, roomName, username, onBack }: { roomId: string, roomName: string, username: string, onBack: () => void }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [userCount, setUserCount] = useState(1);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socketRef.current = io(SOCKET_URL);
        socketRef.current.on("connect", () => {
            setIsConnected(true);
            socketRef.current?.emit("join_room", { room: roomId, username, gender: "unspecified" });
        });

        socketRef.current.on("receive_message", (data: any) => {
            const isMe = data.senderName === username && data.sender !== "system";
            const newMessage = {
                id: data.id || crypto.randomUUID(),
                sender: data.sender === "system" ? "system" : (isMe ? "user" : "stranger"),
                senderName: data.senderName,
                senderCountry: data.senderCountry,
                senderGender: data.senderGender,
                text: data.text,
                timestamp: data.timestamp || Date.now(),
            };
            setMessages((prev) => [...prev.slice(-49), newMessage]);
        });

        socketRef.current.on("room_meta", (data: { count: number }) => setUserCount(data.count));
        return () => { socketRef.current?.disconnect(); };
    }, [roomId, username]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!inputValue.trim() || !socketRef.current) return;
        socketRef.current.emit("send_message", { room: roomId, senderName: username, text: inputValue, timestamp: Date.now(), id: crypto.randomUUID() });
        setInputValue("");
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950/50 w-full">
            <header className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 backdrop-blur-sm w-full">
                <div className="flex items-center gap-3">
                    <Button onClick={onBack} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-glow-purple text-base font-bold tracking-tight">{roomName}</h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500 box-glow-cyan" : "bg-red-500"} animate-pulse`} />
                                <span className="text-[10px] text-muted-foreground">{isConnected ? "Online" : "Off"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5">
                                <Users className="h-3 w-3 text-accent" />
                                <span className="text-[10px] font-medium text-foreground">{userCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <ScrollArea className="flex-1 px-4 py-4 w-full">
                {/* Removido o mx-auto e o max-w-3xl para esticar 100% */}
                <div className="space-y-3 w-full flex flex-col items-stretch">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} sender={msg.sender} senderName={msg.senderName} senderCountry={msg.senderCountry} senderGender={msg.senderGender} text={msg.text} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="border-t border-border bg-card/60 px-4 py-3 backdrop-blur-sm w-full">
                <div className="flex w-full gap-2 items-center">
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder={`Chat in ${roomName}...`}
                        disabled={!isConnected}
                        className="flex-1 border-border bg-background/50 text-foreground focus-visible:ring-primary"
                    />
                    <Button onClick={sendMessage} disabled={!inputValue.trim() || !isConnected} className="gradient-btn border-0 transition-all hover:scale-105 shrink-0">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const SidePanel = ({ username }: { username: string }) => {
    const [activeRoom, setActiveRoom] = useState<{ id: string, name: string } | null>({
        id: "global",
        name: "Global Chat"
    });

    if (activeRoom) {
        return (
            <RoomChatView 
                roomId={activeRoom.id} 
                roomName={activeRoom.name} 
                username={username} 
                onBack={() => setActiveRoom(null)} 
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-zinc-950/50 border-l border-zinc-800 w-full">
            {/* O restante do código da lista de salas permanece igual */}
            <header className="flex items-center justify-between border-b border-border bg-card/60 px-6 py-4 backdrop-blur-sm w-full">
                <h1 className="text-glow-purple text-xl font-black tracking-tighter uppercase">PUBLIC ROOMS</h1>
            </header>
            
            <ScrollArea className="flex-1 px-4 py-4 w-full">
                <div className="space-y-3 w-full">
                    {roomsData.map((room) => (
                        <div 
                            key={room.id}
                            onClick={() => setActiveRoom({ id: room.id, name: room.name })}
                            className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card/40 p-4 transition-all hover:scale-[1.01] hover:bg-card/80 hover:box-glow-purple hover:border-primary/50 w-full"
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${room.bg} ${room.color} ring-1 ring-white/5 group-hover:scale-110 transition-transform shrink-0`}>
                                <room.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary truncate">{room.name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{room.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default SidePanel;