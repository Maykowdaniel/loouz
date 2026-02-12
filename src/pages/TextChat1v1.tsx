import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, SkipForward, User, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage"; 
import SidePanel from "@/components/SidePanel"; // <--- NOVO
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  
  // --- ESTADOS DE CHAT ---
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(t('text_chat.status_searching')); 
  const [isPaired, setIsPaired] = useState(false);
  
  // --- ESTADOS DO PARCEIRO ---
  const [partnerName, setPartnerName] = useState(t('text_chat.partner_default'));
  const [partnerCountry, setPartnerCountry] = useState("UN");
  const [partnerGender, setPartnerGender] = useState<"male" | "female" | "unspecified">("unspecified");
  
  // --- ESTADOS DO USUÁRIO ---
  const state = location.state as { name?: string; gender?: "male" | "female" | "unspecified" } | null;
  const [userData] = useState({
      name: state?.name || `Guest${Math.floor(Math.random() * 90000) + 10000}`,
      gender: state?.gender || "unspecified"
  });

  const [myId, setMyId] = useState<string>("");

  // --- LOGICA MOBILE (TIMER & BOT) ---
  const [timer, setTimer] = useState(10); // Cronômetro de 10 segundos
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- EFEITO DO CRONÔMETRO (Apenas Mobile/Não Pareado) ---
  useEffect(() => {
    // Se não está pareado, inicia contagem
    if (!isPaired) {
        setTimer(10); // Reseta para 10
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    // Chegou a 0: Disparar Bot
                    handleBotFallback();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    } else {
        // Se pareou, limpa o timer
        if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaired]); // Roda quando o status de pareamento muda

  // --- FUNÇÃO DO BOT (Placeholder) ---
  const handleBotFallback = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    console.log("⏰ Tempo esgotado! Iniciando Bot...");
    
    // AQUI VOCÊ VAI IMPLEMENTAR A LÓGICA DO BOT DEPOIS
    // Por enquanto, apenas para teste visual, vamos manter procurando
    // ou mudar o texto para "Quase lá..."
  };

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
        setMyId(socketRef.current?.id || "");
    });

    socketRef.current.on("text_paired", (data: any) => {
      // Tocar som de notificação (opcional)
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.play().catch(() => {});

      setStatus(t('text_chat.status_connected'));
      setIsPaired(true); // Isso vai parar o cronômetro automaticamente pelo useEffect acima
      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);
      if (data.partnerGender) setPartnerGender(data.partnerGender);
      
      setMessages([{ 
        id: "sys-start", 
        sender: "system", 
        text: t('text_chat.welcome_msg', { name: data.partnerName }) 
      }]);
    });

    socketRef.current.on("receive_1v1_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("text_partner_disconnected", () => {
      setMessages((prev) => [...prev, { 
        id: "sys-disc", 
        sender: "system", 
        text: t('text_chat.partner_left', { name: partnerName }) 
      }]);
      setIsPaired(false); // Reinicia o timer para procurar novo
      setStatus(t('text_chat.status_disconnected'));
    });

    socketRef.current.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });

    return () => { socketRef.current?.disconnect(); };
  }, [t, partnerName, userData]);

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
    setIsPaired(false); // Reseta o timer
    setStatus(t('text_chat.status_searching'));
    setPartnerName(t('text_chat.partner_default'));
    setPartnerCountry("UN");
    setPartnerGender("unspecified");
    
    socketRef.current?.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });
  };

  return (
    <div className="gradient-bg flex h-screen overflow-hidden">
      
      {/* === COLUNA ESQUERDA (Chat 1v1) - Ocupa tudo no Mobile, Parte no Desktop === */}
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
                {isPaired ? partnerName : "Procurando..."} 
                <span className="text-lg">{getFlagEmoji(partnerCountry)}</span>
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-green-500 flex items-center gap-2">
                 {status}
                </div>
            </div>
            </div>
        </div>

        {/* MENSAGENS 1v1 */}
        <ScrollArea className="flex-1 px-4 py-4 relative">
             {/* OVERLAY DE PROCURA (Apenas Mobile quando não pareado) */}
             {!isPaired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20 text-center px-6">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Procurando alguém...</h3>
                    
                    {/* CRONÔMETRO (Visível apenas no mobile ou se quiser em ambos) */}
                    <div className="text-4xl font-black text-zinc-700 font-mono mt-2">
                        00:{timer < 10 ? `0${timer}` : timer}
                    </div>
                    <p className="text-xs text-zinc-500 mt-4 max-w-xs">
                        Aguarde enquanto conectamos você com o mundo.
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
                <SkipForward size={18} className="mr-2" /> {t('text_chat.btn_skip')}
            </Button>
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t('text_chat.placeholder')}
                className="flex-1 border-border bg-background/50 text-foreground rounded-full focus-visible:ring-primary"
                disabled={!isPaired}
            />
            <Button onClick={handleSend} disabled={!isPaired} className="gradient-btn rounded-full w-12 h-10 p-0">
                <Send size={18} />
            </Button>
            </div>
        </div>

      </div>

     {/* === COLUNA DIREITA (SidePanel) === */}
{/* Aumentei para w-[450px] para ficar mais largo e confortável */}
<div className="hidden md:flex w-[30%] h-full shadow-2xl z-30 border-l border-zinc-800">
   <SidePanel username={userData.name} />
</div>

    </div>
  );
};

export default TextChat1v1;