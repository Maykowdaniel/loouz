import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, SkipForward, User, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage"; 
import SidePanel from "@/components/SidePanel";

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === "UN") return "🌐";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const TextChat1v1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Looking for a stranger..."); 
  const [isPaired, setIsPaired] = useState(false);
  
  const [partnerName, setPartnerName] = useState("Stranger");
  const [partnerCountry, setPartnerCountry] = useState("UN");
  const [partnerGender, setPartnerGender] = useState<"male" | "female" | "unspecified">("unspecified");
  
  const state = location.state as { name?: string; gender?: "male" | "female" | "unspecified" } | null;
  const [userData] = useState({
      name: state?.name || `Guest${Math.floor(Math.random() * 90000) + 10000}`,
      gender: state?.gender || "unspecified"
  });

  const [myId, setMyId] = useState<string>("");

  // --- LÓGICA DO CRONÓMETRO ---
  const [timer, setTimer] = useState(10); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Função para reiniciar a busca e o timer
  const handleBotFallback = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    
    console.log("⏰ Tempo esgotado! Reiniciando busca...");
    
    setTimer(10); // Reinicia o estado para 10
    
    // Notifica o servidor para manter o utilizador na fila
    socketRef.current?.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });
  };

  // Efeito que controla a contagem regressiva e o reinício
  useEffect(() => {
    if (!isPaired) {
      if (timer === 0) {
        handleBotFallback();
        return;
      }

      const id = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(id);
    }
  }, [isPaired, timer]); // O timer como dependência garante o loop correto

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
        setMyId(socketRef.current?.id || "");
    });

    socketRef.current.on("text_paired", (data: any) => {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});

      setStatus("Connected");
      setIsPaired(true); 
      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);
      if (data.partnerGender) setPartnerGender(data.partnerGender);
      
      setMessages([{ 
        id: "sys-start", 
        sender: "system", 
        text: `You are talking to ${data.partnerName}. Say hi!` 
      }]);
    });

    socketRef.current.on("receive_1v1_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("text_partner_disconnected", () => {
      setMessages((prev) => [...prev, { 
        id: "sys-disc", 
        sender: "system", 
        text: `${partnerName} has disconnected.` 
      }]);
      setIsPaired(false); 
      setTimer(10);
      setStatus("Partner logged out. Click skip.");
    });

    socketRef.current.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });

    return () => { socketRef.current?.disconnect(); };
  }, [partnerName, userData]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !isPaired) return;
    
    socketRef.current?.emit("send_1v1_message", {
      text: input,
      senderId: socketRef.current.id, 
      timestamp: Date.now(),
      id: crypto.randomUUID()
    });
    setInput("");
  };

  const handleSkip = () => {
    setMessages([]);
    setIsPaired(false);
    setTimer(10);
    setStatus("Looking for a stranger...");
    setPartnerName("Stranger");
    setPartnerCountry("UN");
    setPartnerGender("unspecified");
    
    socketRef.current?.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });
  };

  return (
    <div className="gradient-bg flex h-screen overflow-hidden">
      
      {/* COLUNA ESQUERDA (Chat 1v1) */}
      <div className="flex flex-col flex-1 h-full relative">
        
        {/* Header 1v1 */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-card/60 backdrop-blur-sm z-10">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft size={20} className="text-muted-foreground" />
            </Button>
            <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
                <User size={20} className="text-primary" />
            </div>
            <div>
                <div className="flex items-center gap-2 font-bold text-foreground">
                {isPaired ? partnerName : "Searching..."} 
                <span className="text-lg">{getFlagEmoji(partnerCountry)}</span>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-green-500 flex items-center gap-2">
                 {status}
                </div>
            </div>
            </div>
        </div>

        {/* MENSAGENS E OVERLAY DE ESPERA */}
        <ScrollArea className="flex-1 px-4 py-4 relative">
             {!isPaired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20 text-center px-6">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Searching for someone...</h3>
                    
                    <div className="text-5xl font-black text-red-600 font-mono mt-2 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
                        00:{timer < 10 ? `0${timer}` : timer}
                    </div>
                    <p className="text-xs text-zinc-500 mt-4 max-w-xs">
                        Connecting you to the world...
                    </p>
                </div>
            )}

            <div className="mx-auto max-w-3xl space-y-3">
            {messages.map((msg, i) => {
                const isMe = msg.senderId === myId;
                const visualSender = msg.sender === "system" ? "system" : (isMe ? "user" : "stranger");
                const displayName = isMe ? userData.name : partnerName;
                const displayGender = isMe ? userData.gender : partnerGender;

                return (
                <ChatMessage
                    key={i}
                    sender={visualSender}
                    text={msg.text}
                    senderName={displayName}
                    senderCountry={!isMe ? partnerCountry : undefined} 
                    senderGender={displayGender} 
                />
                );
            })}
            <div ref={scrollRef} />
            </div>
        </ScrollArea>

        {/* INPUT 1v1 */}
        <div className="border-t border-border bg-card/60 px-4 py-3 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto flex gap-2">
            <Button onClick={handleSkip} variant="secondary" className="rounded-full px-4 border border-border">
                <SkipForward size={18} className="mr-2" /> Skip
            </Button>
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border-border bg-background/50 text-foreground rounded-full focus-visible:ring-primary"
                disabled={!isPaired}
            />
            <Button onClick={handleSend} disabled={!isPaired} className="gradient-btn rounded-full w-12 h-10 p-0">
                <Send size={18} />
            </Button>
            </div>
        </div>
      </div>

      {/* COLUNA DIREITA (SidePanel) */}
      <div className="hidden md:flex w-[500px] h-full shadow-2xl z-30 border-l border-zinc-800 flex-none bg-zinc-950">
         <div className="w-full h-full flex flex-col items-stretch">
            <SidePanel username={userData.name} />
         </div>
      </div>
    </div>
  );
};

export default TextChat1v1;