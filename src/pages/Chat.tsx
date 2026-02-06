import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { Send, LogOut, ArrowLeft, Users } from "lucide-react";
import { io, Socket } from "socket.io-client";

export interface Message {
  id: string;
  sender: "user" | "stranger" | "system";
  senderName: string;
  senderCountry?: string;
  senderGender?: "male" | "female" | "unspecified"; // Novo campo
  text: string;
  timestamp: number;
}

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { 
    name?: string; 
    roomName?: string; 
    roomId?: string; 
    gender?: "male" | "female" | "unspecified" // Recebe o gênero
  } | null;

  const userName = state?.name || "Visitante";
  const userGender = state?.gender || "unspecified"; // Pega o gênero ou define padrão
  const roomName = state?.roomName || "Bate-papo Vooz";
  const roomId = state?.roomId || "global";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(1);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      // ENVIANDO O GENDER AQUI
      socketRef.current?.emit("join_room", { 
        room: roomId, 
        username: userName, 
        gender: userGender 
      });
    });

    socketRef.current.on("receive_message", (data: any) => {
      const isMe = data.senderName === userName && data.sender !== "system";
      
      const newMessage: Message = {
        id: data.id || crypto.randomUUID(),
        sender: data.sender === "system" ? "system" : (isMe ? "user" : "stranger"),
        senderName: data.senderName,
        senderCountry: data.senderCountry,
        senderGender: data.senderGender, // Recebendo o gênero do servidor
        text: data.text,
        timestamp: data.timestamp || Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);
    });

    socketRef.current.on("room_meta", (data: { count: number }) => {
      setUserCount(data.count);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, userName, userGender]);

  const sendMessage = async () => {
    const text = inputValue.trim();
    if (!text || !socketRef.current) return;
    if (text.length > 500) return;

    const messageData = {
      room: roomId,
      senderName: userName,
      text: text,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    };

    await socketRef.current.emit("send_message", messageData);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleLeaveRoom = () => {
    socketRef.current?.disconnect();
    navigate("/lobby", { state: { name: userName, gender: userGender } });
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    navigate("/");
  };

  return (
    <div className="gradient-bg flex h-screen flex-col">
      {/* Header (Igual ao anterior) */}
      <header className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button onClick={handleLeaveRoom} variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-glow-purple text-lg font-bold tracking-tight">{roomName}</h1>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                 <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500 box-glow-cyan" : "bg-red-500"} animate-pulse`} />
                 <span className="text-xs text-muted-foreground">{isConnected ? "Online" : "Off"}</span>
               </div>
               <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2 py-0.5">
                  <Users className="h-3 w-3 text-accent" />
                  <span className="text-xs font-medium text-foreground">{userCount}</span>
               </div>
            </div>
          </div>
        </div>
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="mr-1 h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </Button>
      </header>

      {/* Area de mensagens */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
              <div className="mb-4 rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Bem-vindo à sala {roomName}!</h3>
              <p className="max-w-xs text-sm text-muted-foreground">Envie uma mensagem para começar.</p>
            </div>
          )}

          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              sender={msg.sender}
              senderName={msg.senderName}
              senderCountry={msg.senderCountry}
              senderGender={msg.senderGender} // Passando o gênero
              text={msg.text}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area (Igual ao anterior) */}
      <div className="border-t border-border bg-card/60 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Conversar em ${roomName}...`}
            disabled={!isConnected}
            maxLength={500}
            className="flex-1 border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
          />
          <Button onClick={sendMessage} disabled={!inputValue.trim() || !isConnected} className="gradient-btn border-0 text-primary-foreground transition-all hover:scale-105 hover:box-glow-purple">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;