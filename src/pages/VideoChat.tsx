import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Video, VideoOff, Mic, MicOff, SkipForward } from "lucide-react";
import SimplePeer from "simple-peer";
import { io, Socket } from "socket.io-client";
import { useTranslation } from "react-i18next"; // ✅ i18n integrado

const SOCKET_URL = "https://loouz-oficial-final.onrender.com";

const VideoChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // ✅ Inicialização do hook de tradução
  
  const state = location.state as { name?: string; gender?: string } | null;
  const userData = {
      name: state?.name || "Visitante",
      gender: state?.gender || "unspecified"
  };

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [partnerStream, setPartnerStream] = useState<MediaStream | null>(null);
  const [callAccepted, setCallAccepted] = useState(false);
  
  // ✅ Status inicial agora é dinâmico
  const [status, setStatus] = useState(t('video_searching')); 
  
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const myVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);
  const socket = useRef<Socket | null>(null);
  const peerRef = useRef<SimplePeer.Instance | null>(null);

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
          setStatus(t('video_connecting')); // ✅ Traduzido

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
            setStatus(t('video_connected')); // ✅ Traduzido
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
        setStatus(t('video_error')); // ✅ Traduzido
      });

    return () => {
      socket.current?.disconnect();
      if(stream) stream.getTracks().forEach(track => track.stop());
      if(peerRef.current) peerRef.current.destroy();
    };
  }, [t]); // ✅ t adicionado às dependências

  const handleSkip = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setCallAccepted(false);
    setPartnerStream(null);
    setStatus(t('video_searching')); // ✅ Traduzido
    
    setTimeout(() => {
      socket.current?.emit("join_video_queue");
    }, 1000);
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  const toggleCam = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !camOn;
      setCamOn(!camOn);
    }
  };

  const handleBack = () => {
    navigate("/lobby", { state: userData });
  };

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      {/* Header com botões e status dinâmicos */}
      <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
        <Button variant="ghost" onClick={handleBack} className="text-white hover:bg-zinc-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
        </Button>
        <span className="font-mono text-sm text-green-400 animate-pulse flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            {status}
        </span>
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden bg-zinc-950">
        {/* Vídeo do Parceiro */}
        <div className="flex-1 flex items-center justify-center relative">
          {callAccepted && partnerStream ? (
            <video playsInline autoPlay ref={partnerVideo} className="w-full h-full object-contain" />
          ) : (
            <div className="text-zinc-500 animate-pulse flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-zinc-800 mb-4 animate-bounce"></div>
                {t('video_waiting')} {/* ✅ Traduzido */}
            </div>
          )}
        </div>

        {/* Meu Vídeo (Miniatura) */}
        <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-64 bg-zinc-900 rounded-xl border border-zinc-700 overflow-hidden shadow-2xl transition-all hover:scale-105">
           <video playsInline autoPlay muted ref={myVideo} className="w-full h-full object-cover" />
           {/* ✅ Ajuste final: "Você" agora usa a chave "video_chat.you" do i18n */}
           <div className="absolute bottom-2 left-2 text-[10px] bg-black/50 px-2 py-1 rounded text-white uppercase font-bold tracking-wider">
             {t('video_chat.you')} 
           </div>
        </div>
      </div>

      {/* Controles Inferiores */}
      <div className="p-6 bg-zinc-900 flex justify-center gap-6 border-t border-zinc-800">
        <Button onClick={toggleMic} variant="outline" size="icon" className={`rounded-full w-14 h-14 border-0 ${micOn ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
          {micOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>
        <Button onClick={toggleCam} variant="outline" size="icon" className={`rounded-full w-14 h-14 border-0 ${camOn ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}>
          {camOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
        </Button>
        <Button 
          onClick={handleSkip} 
          className="rounded-full px-8 h-14 bg-white text-black hover:bg-zinc-200 font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <SkipForward className="mr-2 h-5 w-5" /> {t('btn_skip')}
        </Button>
      </div>
    </div>
  );
};

export default VideoChat;