import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Video, Globe, Shield, Zap, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToContent = () => {
    document.getElementById('more-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="gradient-bg flex flex-col">
      
      {/* --- HERO SECTION (100% da Tela - Layout Flexível) --- */}
      {/* min-h-[100dvh] garante altura total, mas permite crescer se a tela for muito pequena */}
      <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between px-4 py-8">
        
        {/* 1. ESPAÇO VAZIO SUPERIOR (Para equilibrar) */}
        <div className="flex-none h-10 sm:h-20"></div>

        {/* 2. CONTEÚDO CENTRAL (Logo, Textos e Botões) */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl">
          
          {/* Logo Principal */}
          <div className="animate-fade-in-up mb-6 scale-110 sm:scale-125">
            <h1 className="text-glow-purple text-7xl font-black tracking-tighter sm:text-8xl md:text-9xl">
              lo<span className="text-accent">uu</span>z
            </h1>
          </div>

          {/* Título Principal */}
          <h2 
            className="animate-fade-in-up mb-4 max-w-3xl text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-br from-white via-purple-50 to-purple-400 bg-clip-text text-transparent drop-shadow-sm leading-tight"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            {t('intro')}
          </h2>

          {/* Subtítulo */}
          <p
            className="animate-fade-in-up mb-10 max-w-lg text-center text-lg text-zinc-400 sm:text-xl font-medium"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            {t('omegle')}
          </p>

          {/* --- BOTOES NO ESTILO VOOZ --- */}
          <div
            className="animate-fade-in-up flex flex-col w-full max-w-xs gap-4 sm:flex-row sm:max-w-2xl sm:gap-6"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            {/* Botão 1: TEXT CHAT (Estilo Secundário/Claro igual Vooz) */}
            <Button
              onClick={() => navigate("/setup")}
              size="lg"
              className="flex-1 h-16 rounded-full bg-zinc-200 text-zinc-900 hover:bg-white hover:scale-105 transition-all text-xl font-bold shadow-lg"
            >
              <MessageSquare className="mr-2 h-6 w-6" />
              {t('btn_enter')} {/* "Text Chat" no seu i18n */}
            </Button>

            {/* Botão 2: VIDEO CHAT (Estilo Principal + PULSANDO) */}
            <Button
              onClick={() => navigate("/setup")}
              size="lg"
              className="flex-1 h-16 rounded-full gradient-btn text-white hover:box-glow-purple hover:scale-105 transition-all text-xl font-bold shadow-xl shadow-purple-900/30 relative overflow-hidden"
            >
              {/* Efeito de Pulso (Anel brilhante) */}
              <span className="absolute inset-0 rounded-full animate-ping bg-purple-500 opacity-20 duration-1000"></span>
              
              <Video className="mr-2 h-6 w-6 relative z-10" />
              <span className="relative z-10">{t('btn_video')}</span> {/* "Video Chat" no seu i18n */}
            </Button>
          </div>

        </div>

        {/* 3. RODAPÉ (Aviso de Idade + Seta) */}
        {/* mb-4 garante margem do fundo da tela */}
        <div className="flex flex-col items-center gap-4 mt-8 animate-fade-in-up" style={{ animationDelay: "0.45s", opacity: 0 }}>
          
          {/* Aviso de Idade (Agora flui com a página, não sobrepõe) */}
          <p className="text-center text-xs text-muted-foreground/60 max-w-sm px-4">
            {t('age_warning_1')}
            <button
              onClick={() => navigate("/terms")}
              className="text-white/40 underline underline-offset-2 transition-colors hover:text-accent ml-1"
            >
              {t('age_warning_2')}
            </button>{" "}
            {t('age_warning_3')}
          </p>

          {/* Seta Pula-Pula */}
          <div 
            onClick={scrollToContent}
            className="animate-bounce cursor-pointer text-white/20 hover:text-white transition-colors pt-2"
          >
            <ChevronDown size={32} />
          </div>
        </div>

      </div>

      {/* --- SEO SECTION (Abaixo da dobra) --- */}
      <div id="more-content" className="w-full bg-black/40 py-24 backdrop-blur-md border-t border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
            
            {/* Tópico 1 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left group">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 transition-all group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-300">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">{t('seo_title_1')}</h3>
              <p className="text-base text-zinc-400 leading-relaxed">
                {t('seo_desc_1')}
              </p>
            </div>

            {/* Tópico 2 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left group">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20 transition-all group-hover:scale-110 group-hover:bg-pink-500/20 group-hover:text-pink-300">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">{t('seo_title_2')}</h3>
              <p className="text-base text-zinc-400 leading-relaxed">
                {t('seo_desc_2')}
              </p>
            </div>

            {/* Tópico 3 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left group">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 transition-all group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-white">{t('seo_title_3')}</h3>
              <p className="text-base text-zinc-400 leading-relaxed">
                {t('seo_desc_3')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;