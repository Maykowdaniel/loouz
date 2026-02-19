import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, SkipForward } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage"; 

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === "UN") return "🌐";
  return countryCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

// Se for teste local:
const SOCKET_URL = "https://loouz-oficial-final.onrender.com"; 
// const SOCKET_URL = "http://localhost:3001";

const TextChat1v1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Connecting..."); 
  const [isPaired, setIsPaired] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  const [partnerName, setPartnerName] = useState("Stranger");
  const [partnerCountry, setPartnerCountry] = useState("UN");

  // DADOS DO USUÁRIO QUE VIERAM DA HOME (Sem Avatar)
  const state = location.state as { 
      name?: string; 
      country?: string; 
      gender?: 'm' | 'f'; 
      lookingFor?: 'm' | 'f' | 'any';
  } | null;

  const userDataRef = useRef({
      name: state?.name || `Guest${Math.floor(Math.random() * 90000)}`,
      country: state?.country || 'global',
      gender: state?.gender || 'm',
      lookingFor: state?.lookingFor || 'any'
  });

  const [myId, setMyId] = useState<string>("");
  const [timer, setTimer] = useState(10); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const joinQueue = () => {
     if (socketRef.current) {
        socketRef.current.emit("join_text_queue", { 
            name: userDataRef.current.name, 
            country: userDataRef.current.country,
            gender: userDataRef.current.gender,
            lookingFor: userDataRef.current.lookingFor
        });
     }
  };

  const handleBotFallback = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setTimer(10); 
    joinQueue();
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
        setMyId(socketRef.current?.id || "");
        joinQueue(); 
    });

    socketRef.current.on("text_paired", (data: any) => {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});

      setStatus("Connected");
      setIsPaired(true); 
      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);
      
      setMessages([{ 
        id: "sys-start", sender: "system", 
        text: `You are talking to ${data.partnerName}. Say hi!` 
      }]);
    });

    socketRef.current.on("receive_1v1_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      setIsPartnerTyping(false);
    });

    socketRef.current.on("partner_typing", () => {
        setIsPartnerTyping(true);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    socketRef.current.on("partner_stop_typing", () => setIsPartnerTyping(false));

    socketRef.current.on("text_partner_disconnected", () => {
         setMessages((prev) => [...prev, { 
                id: "sys-disc", 
                sender: "system", 
                text: `Partner has disconnected. Searching for new partner...` 
            }]);
            
            setIsPaired(false); 
            setIsPartnerTyping(false);
            setTimer(10);
            setStatus("Searching...");

            setTimeout(() => {
                joinQueue(); 
            }, 1500); 
    });

    return () => { if (socketRef.current) socketRef.current.disconnect(); };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      if (!isPaired) return;
      socketRef.current?.emit("typing");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => socketRef.current?.emit("stop_typing"), 1000);
  };

  const handleSend = () => {
    if (!input.trim() || !isPaired) return;
    socketRef.current?.emit("stop_typing"); 
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const msgData = {
      text: input,
      senderId: socketRef.current?.id, 
      timestamp: Date.now(),
      id: crypto.randomUUID()
    };
    socketRef.current?.emit("send_1v1_message", msgData);
    setInput("");
  };

  const handleSkip = () => {
    setMessages([]);
    setIsPaired(false);
    setIsPartnerTyping(false);
    setTimer(10);
    setStatus("Looking for someone...");
    setPartnerName("Stranger");
    setPartnerCountry("UN");
    joinQueue(); 
  };

  return (
    <div className="fixed inset-0 h-[100dvh] gradient-bg flex overflow-hidden justify-center">
      <div className="flex flex-col flex-1 h-full w-full max-w-5xl relative bg-black/20 shadow-2xl">
        
        {/* Header (Sem foto) */}
        <div className="flex-none flex items-center gap-3 p-4 border-b border-white/5 bg-card/40 backdrop-blur-sm z-50 min-h-[73px]">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft size={20} className="text-muted-foreground" />
            </Button>
            {isPaired && (
                <div className="flex items-center gap-3 overflow-hidden animate-in fade-in slide-in-from-left duration-300">
                  <div className="min-w-0">
                      <div className="flex items-center gap-2 font-bold text-foreground truncate">
                        {partnerName}
                        <span className="text-lg">{getFlagEmoji(partnerCountry)}</span>
                      </div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-green-500 flex items-center gap-2 truncate">
                       {status}
                      </div>
                  </div>
                </div>
            )}
        </div>

        {/* Chat Area */}
        <ScrollArea className="flex-1 min-h-0 px-4 py-4 relative">
             {!isPaired && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40 animate-in fade-in duration-300">
                    <div className="bg-[#1f1f23] border border-white/5 rounded-2xl shadow-2xl px-8 py-10 max-w-sm w-full mx-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                        <h3 className="text-lg font-medium text-zinc-200 tracking-wide animate-pulse mb-8 min-h-[28px]">
                          Looking for a match...
                        </h3>
                         <div className="flex gap-2 opacity-50 mb-10">
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
                        </div>
                        <Button onClick={() => navigate("/")} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-full px-8 py-6 uppercase font-bold tracking-widest w-full">Stop</Button>
                    </div>
                </div>
            )}
            <div className="mx-auto max-w-3xl space-y-3 pb-4">
              {messages.map((msg, i) => {
                  const isMe = msg.senderId === myId;
                  const visualSender = msg.sender === "system" ? "system" : (isMe ? "user" : "stranger");
                  return (
                  <ChatMessage
                      key={i}
                      sender={visualSender}
                      text={msg.text}
                      senderName={isMe ? userDataRef.current.name : partnerName}
                      senderCountry={!isMe ? partnerCountry : undefined} 
                  />
                  );
              })}
              {isPartnerTyping && (
                  <div className="flex items-center gap-2 px-2 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <span className="text-xs text-zinc-500 italic font-medium animate-pulse">Stranger is typing...</span>
                  </div>
              )}
              <div ref={scrollRef} />
            </div>
        </ScrollArea>

        {/* Input */}
        {isPaired && (
            <div className="flex-none border-t border-border bg-card/60 px-4 py-3 backdrop-blur-sm z-50 animate-in slide-in-from-bottom duration-300">
                <div className="max-w-3xl mx-auto flex gap-2">
                <Button onClick={handleSkip} variant="secondary" className="rounded-full px-4 border border-border">
                    <SkipForward size={18} className="mr-2" /> Skip
                </Button>
                <Input 
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type..."
                    className="flex-1 border-border bg-background/50 text-foreground rounded-full focus-visible:ring-primary"
                />
                <Button onClick={handleSend} className="gradient-btn rounded-full w-12 h-10 p-0 flex-shrink-0">
                    <Send size={18} />
                </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default TextChat1v1;