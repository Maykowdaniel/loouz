import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Setup from "./pages/Setup";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import TermsOfService from "./pages/Legal/TermsOfService";
import CommunityGuidelines from "./pages/Legal/CommunityGuidelines";
import NotFound from "./pages/NotFound";
import SeoLandingPage from "./pages/SeoLandingPage";
import NicheChat from "./pages/NicheChat";
import AnonymousChat from "./pages/LandingPages/AnonymousChat";
import TalkToStrangers from "./pages/LandingPages/TalkToStrangers";
import OmegleAlternative from "./pages/LandingPages/OmegleAlternative";
import BlogIndex from "./pages/Blog/BlogIndex";
import BlogPost from "./pages/Blog/BlogPost";

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

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/community-guidelines" element={<CommunityGuidelines />} />

          {/* SEO Landing Pages */}
          <Route path="/random-video-chat" element={<SeoLandingPage />} />
          <Route path="/anonymous-video-chat" element={<SeoLandingPage />} />

          {/* Money Pages - High-converting landing pages */}
          <Route path="/anonymous-chat" element={<AnonymousChat />} />
          <Route path="/talk-to-strangers" element={<TalkToStrangers />} />
          <Route path="/omegle-alternative" element={<OmegleAlternative />} />

          {/* Lar (Botões 1v1) */}
          <Route path="/lobby" element={<Lobby />} />

          {/* Quartos (Lista de Salas) */}
          <Route path="/rooms" element={<Rooms />} />  {/* <--- MUDANÇA AQUI: Usa o Rooms, não o Chat */}

          {/* Modos de Conversa */}
          <Route path="/text-chat" element={<TextChat1v1 />} />
          <Route path="/video" element={<VideoChat />} />
          <Route path="/chat/:slug" element={<NicheChat />} />
          <Route path="/chat" element={<Chat />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;