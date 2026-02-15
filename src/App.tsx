import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Setup from "./pages/Setup";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import SeoLandingPage from "./pages/SeoLandingPage";

import Lobby from "./pages/lobby"; // Agora é o "Lar"
import Rooms from "./pages/Rooms"; // <--- IMPORTAR NOVO ARQUIVO "Quartos"

import VideoChat from "./pages/VideoChat";
import TextChat1v1 from "./pages/TextChat1v1";
import Chat from "./pages/Chat"; // Chat de sala específica

import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/terms" element={<Terms />} />

          {/* SEO Landing Pages */}
          <Route path="/omegle-alternative" element={<SeoLandingPage />} />
          <Route path="/random-video-chat" element={<SeoLandingPage />} />
          <Route path="/anonymous-video-chat" element={<SeoLandingPage />} />
          <Route path="/talk-to-strangers" element={<SeoLandingPage />} />

          {/* Lar (Botões 1v1) */}
          <Route path="/lobby" element={<Lobby />} />

          {/* Quartos (Lista de Salas) */}
          <Route path="/rooms" element={<Rooms />} />  {/* <--- MUDANÇA AQUI: Usa o Rooms, não o Chat */}

          {/* Modos de Conversa */}
          <Route path="/text-chat" element={<TextChat1v1 />} />
          <Route path="/video" element={<VideoChat />} />
          <Route path="/chat" element={<Chat />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;