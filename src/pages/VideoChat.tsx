import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SkipForward, Flag, LogOut, Mail, CheckCircle2 } from "lucide-react"; 
import SimplePeer from "simple-peer";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";
const STATUS_SEARCHING = "Searching for someone...";
const STATUS_CONNECTING = "Connecting...";
const STATUS_CONNECTED = "Connected!";
const STATUS_ERROR = "Error: Allow camera access.";

// Tempo de espera (em ms) para exibir a mensagem de e-mail (15 segundos)
const MATCH_TIMEOUT_MS = 15000;

const VideoChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { name?: string; gender?: string; from?: string } | null;
  
  // 1. Pega a página de origem (ex: "/chat/usa"), fallback para "/"
  const fromPath = state?.from || "/";

  const userData = {
      name: state?.name || "Guest",
      gender: state?.gender || "unspecified"
  };

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [partnerStream, setPartnerStream] = useState<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [status, setStatus] = useState(STATUS_SEARCHING); 

  // Estados para a mensagem de timeout / e-mail
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  const myVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const currentPartnerId = useRef<string | null>(null);

  // 2. Lista de parceiros já visitados nesta sessão
  const visitedPartners = useRef<string[]>([]);
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Inicia ou reinicia o temporizador de timeout de match
  const resetSearchTimer = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setShowEmailPrompt(false);

    searchTimer.current = setTimeout(() => {
      setShowEmailPrompt(true);
    }, MATCH_TIMEOUT_MS);
  };

  const clearSearchTimer = () => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
      searchTimer.current = null;
    }
    setShowEmailPrompt(false);
  };

  useEffect(() => {
    if (partnerVideo.current && partnerStream) {
      partnerVideo.current.srcObject = partnerStream;
    }
  }, [partnerStream, callAccepted]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) myVideo.current.srcObject = currentStream;
        
        socket.current = io(SOCKET_URL);
        
        socket.current.on("receive_signal", ({ signal }) => {
          if (peerRef.current && !peerRef.current.destroyed) {
            peerRef.current.signal(signal);
          }
        });

        socket.current.on("partner_disconnected", () => {
          handleSkip(); 
        });

        socket.current.on("start_call", ({ socketId, initiator }) => {
          clearSearchTimer(); // Match encontrado! Cancela a mensagem de e-mail
          setStatus(STATUS_CONNECTING);
          currentPartnerId.current = socketId; 

          // Guarda o ID para não repetir o match
          if (socketId && !visitedPartners.current.includes(socketId)) {
            visitedPartners.current.push(socketId);
          }

          if (peerRef.current) {
            peerRef.current.destroy();
          }

          const peer = new SimplePeer({
            initiator: initiator,
            trickle: false,
            stream: currentStream,
          });

          peer.on("signal", (data) => {
            socket.current?.emit("send_signal", { userToCall: socketId, signalData: data });
          });

          peer.on("stream", (remoteStream) => {
            setPartnerStream(remoteStream);
            setCallAccepted(true);
            setStatus(STATUS_CONNECTED);
          });

          peer.on("error", (err) => {
            console.error("Erro no Peer:", err);
            handleSkip(); 
          });

          peerRef.current = peer;
        });

        // Inicia a fila e ativa o timer de timeout
        socket.current.emit("join_video_queue", { 
          previousPartners: visitedPartners.current 
        });
        resetSearchTimer();
      })
      .catch((err) => {
        console.error("Media error:", err);
        setStatus(STATUS_ERROR);
      });

    return () => {
      clearSearchTimer();
      socket.current?.disconnect();
      if(stream) stream.getTracks().forEach(track => track.stop());
      if(peerRef.current) peerRef.current.destroy();
    };
  }, []);

  const handleSkip = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setCallAccepted(false);
    setPartnerStream(null);
    currentPartnerId.current = null;
    setStatus(STATUS_SEARCHING);
    
    resetSearchTimer(); // Reinicia o timer ao dar Skip

    setTimeout(() => {
      // 3. Manda a lista de parceiros anteriores ao entrar na fila novamente
      socket.current?.emit("join_video_queue", { 
        previousPartners: visitedPartners.current 
      });
    }, 500);
  };

  const handleStop = () => {
    clearSearchTimer();
    socket.current?.disconnect();
    if(stream) stream.getTracks().forEach(track => track.stop());
    
    // 4. Redireciona de volta para a rota anterior (ex: "/chat/usa")
    navigate(fromPath); 
  };

  const handleReport = () => {
    if (!currentPartnerId.current) return;
    alert("User reported successfully!");
    handleSkip();
  };

  const handleRegisterEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail && userEmail.includes("@")) {
      socket.current?.emit("register_notification_email", { email: userEmail });
      setEmailSubmitted(true);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-white overflow-hidden">
      
      <style>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
      `}</style>

      {/* --- ÁREA DOS VÍDEOS --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* PARCEIRO (Cima no Mobile / Esquerda no PC) */}
        <div className="relative bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 h-1/2 w-full md:h-full md:w-1/2 transition-all">
          {callAccepted && partnerStream ? (
            <video 
              playsInline 
              autoPlay 
              ref={partnerVideo} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center animate-pulse w-full h-full max-w-md mx-auto">
               <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
                  <span className="loading loading-spinner loading-lg text-purple-500"></span>
               </div>
               <p className="text-zinc-300 text-lg font-medium tracking-wide mb-2">
                 {status}
               </p>

               {/* 5. TELA DE ESPERA AGRADÁVEL COM CAPTURA DE E-MAIL */}
               {showEmailPrompt && (
                 <div className="mt-4 p-4 bg-zinc-900/90 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl animate-in fade-in zoom-in duration-300 w-full">
                   <p className="text-xs sm:text-sm text-zinc-300 mb-3 leading-relaxed">
                     We couldn't find anyone online right now. Would you like to be notified by email when peak activity starts?
                   </p>

                   {emailSubmitted ? (
                     <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                       <CheckCircle2 size={16} />
                       You'll be notified soon!
                     </div>
                   ) : (
                     <form onSubmit={handleRegisterEmail} className="flex gap-2">
                       <input 
                         type="email" 
                         placeholder="your@email.com"
                         value={userEmail}
                         onChange={(e) => setUserEmail(e.target.value)}
                         className="flex-1 bg-zinc-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500"
                         required
                       />
                       <Button 
                         type="submit" 
                         className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase px-3 py-2 rounded-xl transition-all"
                       >
                         <Mail size={14} className="mr-1" />
                         Notify
                       </Button>
                     </form>
                   )}
                 </div>
               )}
            </div>
          )}
        </div>

        {/* VOCÊ (Baixo no Mobile / Direita no PC) */}
        <div className="relative bg-zinc-900 flex items-center justify-center h-1/2 w-full md:h-full md:w-1/2 transition-all">
          <video 
            playsInline 
            autoPlay 
            muted 
            ref={myVideo} 
            className="w-full h-full object-cover mirror-mode" 
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            You
          </div>
        </div>
      </div>

      {/* --- RODAPÉ: CONTROLES --- */}
      <div className="h-20 bg-zinc-950 flex items-center justify-between px-6 md:px-12 border-t border-white/5 relative z-50 flex-none">
        
        <Button 
          onClick={handleSkip} 
          className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl h-12 w-16 md:w-24 border border-zinc-700 shadow-lg"
        >
          <SkipForward className="h-6 w-6" />
        </Button>

        <Button 
          onClick={handleStop} 
          className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-14 w-20 md:w-32 shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 transform hover:scale-105 transition-all"
        >
          <LogOut className="h-7 w-7 mr-1" />
        </Button>

        <Button 
          onClick={handleReport} 
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 rounded-2xl h-12 w-16 md:w-24 border border-zinc-700 shadow-lg"
        >
          <Flag className="h-6 w-6" />
        </Button>

      </div>
    </div>
  );
};

export default VideoChat;