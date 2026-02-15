import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Globe } from "lucide-react";
import { io, Socket } from "socket.io-client";

// Reutiliza o estilo de mensagem, mas simplificado para a lateral
const MiniMessage = ({ sender, text, name }: { sender: string, text: string, name: string }) => (
  <div className={`mb-2 text-sm ${sender === "system" ? "text-yellow-500 italic" : "text-white"}`}>
    <span className="font-bold text-zinc-400">{name}: </span>
    <span className="break-all">{text}</span>
  </div>
);

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const MiniGlobalChat = ({ username }: { username: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Conexão independente para o Global
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
        socketRef.current?.emit("join_room", { 
            room: "global", 
            username: username, 
            gender: "unspecified" 
        });
    });

    socketRef.current.on("receive_message", (msg: any) => {
        // Mantém apenas as últimas 50 mensagens para não pesar
        setMessages((prev) => [...prev.slice(-49), msg]);
    });

    return () => {
        socketRef.current?.disconnect();
    };
  }, [username]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    socketRef.current?.emit("send_message", {
      room: "global",
      senderName: username,
      text: input,
      id: crypto.randomUUID()
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 border-l border-zinc-800">
      {/* Header do Mini Chat */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-2">
        <Globe className="w-4 h-4 text-purple-500" />
        <span className="font-bold text-sm text-zinc-300">Global Chat</span>
      </div>

      {/* Lista de Mensagens */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-1">
            {messages.map((msg, i) => (
                <MiniMessage 
                    key={i} 
                    sender={msg.sender} 
                    name={msg.senderName} 
                    text={msg.text} 
                />
            ))}
            <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-2 border-t border-zinc-800 bg-zinc-950/30">
        <div className="flex gap-2">
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Diga oi pro mundo..."
                className="h-8 text-xs bg-zinc-800 border-none focus-visible:ring-1 focus-visible:ring-purple-500"
            />
            <Button size="icon" className="h-8 w-8 bg-purple-600 hover:bg-purple-700" onClick={handleSend}>
                <Send className="w-3 h-3" />
            </Button>
        </div>
      </div>
    </div>
  );
};

export default MiniGlobalChat;