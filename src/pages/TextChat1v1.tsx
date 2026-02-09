import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, SkipForward, User } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage"; 

// Função para bandeira
const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === "UN") return "🌐";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const SOCKET_URL = "http://localhost:3001"; 

const TextChat1v1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("Procurando um estranho...");
  const [isPaired, setIsPaired] = useState(false);
  
  // Dados do Parceiro
  const [partnerName, setPartnerName] = useState("Estranho");
  const [partnerCountry, setPartnerCountry] = useState("UN");
  const [partnerGender, setPartnerGender] = useState<"male" | "female" | "unspecified">("unspecified");
  
  // Meus dados
  const userData = location.state as { name: string; gender: "male" | "female" | "unspecified" } || { name: "Guest", gender: "unspecified" };
  const [myId, setMyId] = useState<string>("");

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
        setMyId(socketRef.current?.id || "");
    });

    // Atualizei para receber o gender também, se o backend mandar
    socketRef.current.on("text_paired", (data: any) => {
      setStatus("Conectado!");
      setIsPaired(true);
      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);
      // Se o backend enviar gender no futuro, já está pronto:
      if (data.partnerGender) setPartnerGender(data.partnerGender);
      
      setMessages([{ 
        id: "sys-start", 
        sender: "system", 
        text: `Você está conversando com ${data.partnerName}. Diga oi!` 
      }]);
    });

    socketRef.current.on("receive_1v1_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("text_partner_disconnected", () => {
      setMessages((prev) => [...prev, { 
        id: "sys-disc", 
        sender: "system", 
        text: `${partnerName} se desconectou.` 
      }]);
      setIsPaired(false);
      setStatus("Parceiro saiu. Clique em pular.");
    });

    socketRef.current.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });

    return () => { socketRef.current?.disconnect(); };
  }, []);

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
    setStatus("Procurando alguém...");
    setPartnerName("Estranho");
    setPartnerCountry("UN");
    setPartnerGender("unspecified");
    
    socketRef.current?.emit("join_text_queue", { 
        name: userData.name, 
        gender: userData.gender 
    });
  };

  return (
    <div className="gradient-bg flex h-screen flex-col pb-16">
      
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card/60 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate("/lobby", { state: userData })}>
          <ArrowLeft size={20} className="text-muted-foreground" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center ring-1 ring-primary/30">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-foreground">
              {partnerName} <span className="text-lg">{getFlagEmoji(partnerCountry)}</span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-green-500 animate-pulse">
              {status}
            </div>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.senderId === myId;
            const visualSender = msg.sender === "system" ? "system" : (isMe ? "user" : "stranger");
            const displayName = isMe ? userData.name : partnerName;
            
            // Define o gênero correto para mostrar o ícone azul/rosa
            const displayGender = isMe ? userData.gender : partnerGender;

            return (
              <ChatMessage
                key={i}
                sender={visualSender}
                text={msg.text}
                senderName={displayName}
                senderCountry={!isMe ? partnerCountry : undefined} 
                senderGender={displayGender} 
                // REMOVI O TIMESTAMP DAQUI PARA CORRIGIR O ERRO
              />
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border bg-card/60 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Button onClick={handleSkip} variant="secondary" className="rounded-full px-4 border border-border">
            <SkipForward size={18} className="mr-2" /> Pular
          </Button>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 border-border bg-background/50 text-foreground rounded-full focus-visible:ring-primary"
            disabled={!isPaired}
          />
          <Button onClick={handleSend} disabled={!isPaired} className="gradient-btn rounded-full w-12 h-10 p-0">
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextChat1v1;