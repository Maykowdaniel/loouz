import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SkipForward, Flag, LogOut } from "lucide-react"; 
import SimplePeer from "simple-peer";
import { io, Socket } from "socket.io-client";
import { useTranslation } from "react-i18next";

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const VideoChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const state = location.state as { name?: string; gender?: string } | null;
  const userData = {
      name: state?.name || "Visitante",
      gender: state?.gender || "unspecified"
  };

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [partnerStream, setPartnerStream] = useState<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [status, setStatus] = useState(t('video_chat.video_searching')); 
  
  const myVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);
  const currentPartnerId = useRef<string | null>(null);

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
          setStatus(t('video_chat.video_connecting'));
          currentPartnerId.current = socketId; 

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
            setStatus(t('video_chat.connected'));
          });

          peer.on("error", (err) => {
            console.error("Erro no Peer:", err);
            handleSkip(); 
          });

          peerRef.current = peer;
        });

        socket.current.emit("join_video_queue");
      })
      .catch((err) => {
        console.error("Erro de mídia:", err);
        setStatus(t('video_chat.video_error'));
      });

    return () => {
      socket.current?.disconnect();
      if(stream) stream.getTracks().forEach(track => track.stop());
      if(peerRef.current) peerRef.current.destroy();
    };
  }, [t]);

  const handleSkip = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setCallAccepted(false);
    setPartnerStream(null);
    currentPartnerId.current = null;
    setStatus(t('video_chat.video_searching'));
    
    setTimeout(() => {
      socket.current?.emit("join_video_queue");
    }, 500);
  };

  const handleStop = () => {
    socket.current?.disconnect();
    if(stream) stream.getTracks().forEach(track => track.stop());
    navigate("/"); 
  };

  const handleReport = () => {
    if (!currentPartnerId.current) return;
    console.log(`REPORTANDO USUÁRIO: ${currentPartnerId.current}`);
    alert(t('Usuário reportado com sucesso!')); 
    handleSkip();
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-white overflow-hidden">
      
      {/* Estilo inline para espelhar o vídeo local */}
      <style>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
      `}</style>

      {/* --- ÁREA DOS VÍDEOS --- */}
      {/* Mudei de 'flex-col' para 'flex-col md:flex-row' */}
      {/* No mobile: Um em cima do outro. No PC: Lado a lado. */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* PARCEIRO (Cima no Mobile / Esquerda no PC) */}
        <div className="flex-1 relative bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 md:w-1/2">
          {callAccepted && partnerStream ? (
            <video 
              playsInline 
              autoPlay 
              ref={partnerVideo} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-4 text-center animate-pulse">
               <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
                  <span className="loading loading-spinner loading-lg text-purple-500"></span>
               </div>
               <p className="text-zinc-400 text-lg font-medium tracking-wide">
                 {status}
               </p>
            </div>
          )}
        </div>

        {/* VOCÊ (Baixo no Mobile / Direita no PC) */}
        <div className="flex-1 relative bg-zinc-900 flex items-center justify-center md:w-1/2">
          <video 
            playsInline 
            autoPlay 
            muted 
            ref={myVideo} 
            className="w-full h-full object-cover mirror-mode" 
          />
          <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            {t('video_chat.you')}
          </div>
        </div>
      </div>

      {/* --- RODAPÉ: CONTROLES --- */}
      <div className="h-20 bg-zinc-950 flex items-center justify-between px-6 md:px-12 border-t border-white/5 relative z-50 flex-none">
        
        {/* Botão Pular (Esquerda) */}
        <Button 
          onClick={handleSkip} 
          className="bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl h-12 w-16 md:w-24 border border-zinc-700 shadow-lg"
        >
          <SkipForward className="h-6 w-6" />
        </Button>

        {/* Botão Sair (Centro) */}
        <Button 
          onClick={handleStop} 
          className="bg-red-600 hover:bg-red-700 text-white rounded-2xl h-14 w-20 md:w-32 shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 transform hover:scale-105 transition-all"
        >
          <LogOut className="h-7 w-7 mr-1" />
        </Button>

        {/* Botão Reportar (Direita) */}
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