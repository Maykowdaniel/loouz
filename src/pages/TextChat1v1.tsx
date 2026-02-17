import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, SkipForward, User } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage"; 
import SidePanel from "@/components/SidePanel";

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === "UN") return "🌐";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const SEARCH_PHRASES = [
  "Analyzing your interests...",
  "Finding a match...",
  "Connecting to someone like you...",
  "Searching global database...",
];

// LINK DO RENDER (Produção)
const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const TextChat1v1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Connecting..."); 
  const [isPaired, setIsPaired] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  const [partnerName, setPartnerName] = useState("Stranger");
  const [partnerCountry, setPartnerCountry] = useState("UN");
  
  const state = location.state as { name?: string; interests?: string } | null;
  const userDataRef = useRef({
      name: state?.name || `Guest${Math.floor(Math.random() * 90000) + 10000}`,
      interests: state?.interests || "" 
  });

  const [myId, setMyId] = useState<string>("");
  const [timer, setTimer] = useState(10); 
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBotFallback = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    setTimer(10); 
    
    if (socketRef.current) {
        socketRef.current.emit("join_text_queue", { 
            name: userDataRef.current.name, 
            interests: userDataRef.current.interests 
        });
    }
  };

  useEffect(() => {
    if (!isPaired) {
      const phraseInterval = setInterval(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % SEARCH_PHRASES.length);
      }, 2000);
      return () => clearInterval(phraseInterval);
    }
  }, [isPaired]);

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
  }, [isPaired, timer]); 

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
        console.log("Conectado ao servidor!");
        setMyId(socketRef.current?.id || "");
        
        socketRef.current?.emit("join_text_queue", { 
            name: userDataRef.current.name, 
            interests: userDataRef.current.interests 
        });
    });

    socketRef.current.on("text_paired", (data: any) => {
      console.log("Pareado com:", data);
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});

      setStatus("Connected");
      setIsPaired(true); 
      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);
      
      setMessages([{ 
        id: "sys-start", 
        sender: "system", 
        text: `You are talking to ${data.partnerName}. Say hi!` 
      }]);
    });

    socketRef.current.on("receive_1v1_message", (msg: any) => {
      console.log("Mensagem recebida:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("text_partner_disconnected", () => {
      setMessages((prev) => [...prev, { 
        id: "sys-disc", 
        sender: "system", 
        text: `Partner has disconnected.` 
      }]);
      setIsPaired(false); 
      setTimer(10);
      setStatus("Partner disconnected.");
    });

    return () => { 
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !isPaired) return;
    
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
    setTimer(10);
    setStatus("Looking for someone...");
    setPartnerName("Stranger");
    setPartnerCountry("UN");
    setCurrentPhraseIndex(0); 
    
    socketRef.current?.emit("join_text_queue", { 
        name: userDataRef.current.name, 
        interests: userDataRef.current.interests 
    });
  };

  return (
    <div className="fixed inset-0 h-[100dvh] gradient-bg flex overflow-hidden">
      <div className="flex flex-col flex-1 h-full w-full relative">
        <div className="flex-none flex items-center gap-3 p-4 border-b border-white/5 bg-card/40 backdrop-blur-sm z-50 min-h-[73px]">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft size={20} className="text-muted-foreground" />
            </Button>
            {isPaired && (
                <div className="flex items-center gap-3 overflow-hidden animate-in fade-in slide-in-from-left duration-300">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30 flex-shrink-0">
                      <User size={20} className="text-primary" />
                  </div>
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

        <ScrollArea className="flex-1 min-h-0 px-4 py-4 relative">
             {!isPaired && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/95 z-40 animate-in fade-in duration-300">
                    <div className="bg-[#1f1f23] border border-white/5 rounded-2xl shadow-2xl px-8 py-10 max-w-sm w-full mx-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                        <h3 className="text-lg font-medium text-zinc-200 tracking-wide animate-pulse mb-8 min-h-[28px]">
                          {SEARCH_PHRASES[currentPhraseIndex]}
                        </h3>
                        <div className="flex gap-2 opacity-50 mb-10">
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                             <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce"></div>
                        </div>
                        <Button onClick={() => navigate("/")} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-full px-8 py-6 uppercase font-bold tracking-widest w-full">
                            Stop
                        </Button>
                    </div>
                </div>
            )}
            <div className="mx-auto max-w-3xl space-y-3 pb-4">
              {messages.map((msg, i) => {
                  const isMe = msg.senderId === myId;
                  const visualSender = msg.sender === "system" ? "system" : (isMe ? "user" : "stranger");
                  const displayName = isMe ? userDataRef.current.name : partnerName;
                  return (
                  <ChatMessage
                      key={i}
                      sender={visualSender}
                      text={msg.text}
                      senderName={displayName}
                      senderCountry={!isMe ? partnerCountry : undefined} 
                  />
                  );
              })}
              <div ref={scrollRef} />
            </div>
        </ScrollArea>

        {isPaired && (
            <div className="flex-none border-t border-border bg-card/60 px-4 py-3 backdrop-blur-sm z-50 animate-in slide-in-from-bottom duration-300">
                <div className="max-w-3xl mx-auto flex gap-2">
                <Button onClick={handleSkip} variant="secondary" className="rounded-full px-4 border border-border">
                    <SkipForward size={18} className="mr-2" /> Skip
                </Button>
                <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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
      <div className="hidden md:flex w-[500px] h-full shadow-2xl z-30 border-l border-zinc-800 flex-none bg-zinc-950">
         <div className="w-full h-full flex flex-col items-stretch">
            <SidePanel username={userDataRef.current.name} />
         </div>
      </div>
    </div>
  );
};

export default TextChat1v1;