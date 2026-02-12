import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, SkipForward, User, Loader2 } from "lucide-react";
import { io, Socket } from "socket.io-client";
import ChatMessage from "@/components/ChatMessage";
import SidePanel from "@/components/SidePanel";
import { useTranslation } from "react-i18next";

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode || countryCode === "UN") return "🌐";
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
};

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const TextChat1v1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // ================= ESTADOS =================
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(t("text_chat.status_searching"));
  const [isPaired, setIsPaired] = useState(false);

  const [partnerName, setPartnerName] = useState(
    t("text_chat.partner_default")
  );
  const [partnerCountry, setPartnerCountry] = useState("UN");
  const [partnerGender, setPartnerGender] = useState<
    "male" | "female" | "unspecified"
  >("unspecified");

  const state = location.state as
    | { name?: string; gender?: "male" | "female" | "unspecified" }
    | null;

  const [userData] = useState({
    name:
      state?.name ||
      `Guest${Math.floor(Math.random() * 90000) + 10000}`,
    gender: state?.gender || "unspecified",
  });

  const [myId, setMyId] = useState<string>("");

  // ================= TIMER =================
  const [timer, setTimer] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setTimer(10);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleBotFallback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleBotFallback = () => {
    console.log("⏰ Tempo esgotado! Reiniciando busca...");

    socketRef.current?.emit("join_text_queue", {
      name: userData.name,
      gender: userData.gender,
    });

    startTimer(); // reinicia corretamente
  };

  // ================= CONTROLE DO TIMER =================
  useEffect(() => {
    if (!isPaired) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [isPaired]);

  // ================= SOCKET =================
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("connect", () => {
      setMyId(socketRef.current?.id || "");
    });

    socketRef.current.on("text_paired", (data: any) => {
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
      );
      audio.play().catch(() => {});

      setStatus(t("text_chat.status_connected"));
      setIsPaired(true);

      setPartnerName(data.partnerName);
      setPartnerCountry(data.partnerCountry);

      if (data.partnerGender)
        setPartnerGender(data.partnerGender);

      setMessages([
        {
          id: "sys-start",
          sender: "system",
          text: t("text_chat.welcome_msg", {
            name: data.partnerName,
          }),
        },
      ]);
    });

    socketRef.current.on("receive_1v1_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    socketRef.current.on("text_partner_disconnected", () => {
      setMessages((prev) => [
        ...prev,
        {
          id: "sys-disc",
          sender: "system",
          text: t("text_chat.partner_left", {
            name: partnerName,
          }),
        },
      ]);

      setIsPaired(false);
      setStatus(t("text_chat.status_disconnected"));
    });

    socketRef.current.emit("join_text_queue", {
      name: userData.name,
      gender: userData.gender,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // 👈 IMPORTANTE: vazio

  // ================= AUTO SCROLL =================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ================= AÇÕES =================
  const handleSend = () => {
    if (!input.trim() || !isPaired) return;

    socketRef.current?.emit("send_1v1_message", {
      text: input,
      senderId: socketRef.current?.id,
      timestamp: Date.now(),
      id: crypto.randomUUID(),
    });

    setInput("");
  };

  const handleSkip = () => {
    setMessages([]);
    setIsPaired(false);
    setStatus(t("text_chat.status_searching"));
    setPartnerName(t("text_chat.partner_default"));
    setPartnerCountry("UN");
    setPartnerGender("unspecified");

    socketRef.current?.emit("join_text_queue", {
      name: userData.name,
      gender: userData.gender,
    });
  };

  // ================= UI =================
  return (
    <div className="gradient-bg flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1 h-full relative">
        {/* HEADER */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-card/60 backdrop-blur-sm z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={20} />
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={20} />
            </div>

            <div>
              <div className="flex items-center gap-2 font-bold">
                {isPaired ? partnerName : "Procurando..."}
                <span>{getFlagEmoji(partnerCountry)}</span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-green-500">
                {status}
              </div>
            </div>
          </div>
        </div>

        {/* MENSAGENS */}
        <ScrollArea className="flex-1 px-4 py-4 relative">
          {!isPaired && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 text-center px-6">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Procurando alguém...
              </h3>
              <div className="text-5xl font-black text-red-600 font-mono mt-2">
                00:{timer < 10 ? `0${timer}` : timer}
              </div>
            </div>
          )}

          <div className="mx-auto max-w-3xl space-y-3">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === myId;
              const visualSender =
                msg.sender === "system"
                  ? "system"
                  : isMe
                  ? "user"
                  : "stranger";

              return (
                <ChatMessage
                  key={i}
                  sender={visualSender}
                  text={msg.text}
                  senderName={isMe ? userData.name : partnerName}
                  senderCountry={!isMe ? partnerCountry : undefined}
                  senderGender={
                    isMe ? userData.gender : partnerGender
                  }
                />
              );
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* INPUT */}
        <div className="border-t px-4 py-3">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Button onClick={handleSkip} variant="secondary">
              <SkipForward size={18} className="mr-2" />
              {t("text_chat.btn_skip")}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSend()
              }
              placeholder={t("text_chat.placeholder")}
              disabled={!isPaired}
            />

            <Button
              onClick={handleSend}
              disabled={!isPaired}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>

      {/* SIDEPANEL DESKTOP */}
      <div className="hidden md:flex w-[500px] h-full border-l bg-zinc-950">
        <SidePanel username={userData.name} />
      </div>
    </div>
  );
};

export default TextChat1v1;
