import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Globe, Shield, Zap, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToContent = () => {
    document.getElementById('more-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="gradient-bg flex flex-col">
      
      {/* --- ESTILOS CUSTOMIZADOS PARA A ANIMAÇÃO RADAR --- */}
      {/* Isso cria o efeito "Onda Suave" que não cresce demais */}
      <style>{`
        @keyframes radar {
          0% { transform: scale(1); opacity: 0.3; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .animate-radar {
          animation: radar 3s infinite ease-out;
        }
      `}</style>

      {/* --- HERO SECTION (100% da Tela) --- */}
      <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-between px-4 py-6">
        
        {/* 1. ESPAÇO SUPERIOR */}
        <div className="flex-none h-16"></div>

        {/* 2. CONTEÚDO CENTRAL */}
        <div className="flex flex-col items-center justify-center w-full max-w-4xl z-10">
          
          {/* Logo Principal */}
          <div className="animate-fade-in-up mb-6 scale-110 sm:scale-125">
            <h1 className="text-glow-purple text-7xl font-black tracking-tighter sm:text-8xl md:text-9xl">
              lo<span className="text-accent">uu</span>z
            </h1>
          </div>

          {/* Título Principal */}
          <h2 
            className="animate-fade-in-up mb-4 max-w-3xl text-center text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-br from-white via-purple-50 to-purple-400 bg-clip-text text-transparent drop-shadow-sm leading-tight"
            style={{ animationDelay: "0.1s", opacity: 0 }}
          >
            {t('intro')}
          </h2>

          {/* Subtítulo */}
          <p
            className="animate-fade-in-up mb-8 max-w-md text-center text-base text-zinc-400 sm:text-lg font-medium"
            style={{ animationDelay: "0.2s", opacity: 0 }}
          >
            {t('omegle')}
          </p>

          {/* --- BOTOES (Compactos e Pílula) --- */}
          <div
            className="animate-fade-in-up flex flex-row items-center justify-center gap-4 w-full"
            style={{ animationDelay: "0.3s", opacity: 0 }}
          >
            {/* Botão TEXT CHAT */}
            <Button
              onClick={() => navigate("/setup")}
              className="h-12 w-36 sm:h-14 sm:w-44 rounded-full bg-zinc-200 text-zinc-900 hover:bg-white hover:scale-105 transition-all text-sm sm:text-base font-black uppercase tracking-wider shadow-lg border-0 z-20"
            >
              TEXT CHAT
            </Button>

            {/* Botão VIDEO CHAT (Com Animação Radar Suave) */}
            <Button
              onClick={() => navigate("/setup")}
              className="relative z-10 h-12 w-36 sm:h-14 sm:w-44 rounded-full gradient-btn text-white hover:box-glow-purple hover:scale-105 transition-all text-sm sm:text-base font-black uppercase tracking-wider shadow-xl shadow-purple-900/30 border-0"
            >
              {/* Efeito Radar Customizado (Fica atrás do botão) */}
              <span className="absolute -z-10 inset-0 rounded-full animate-radar bg-white"></span>
              
              <Video className="mr-2 h-5 w-5 sm:h-6 sm:w-6 relative z-20" />
              <span className="relative z-20">VIDEO CHAT</span>
            </Button>
          </div>

        </div>

        {/* 3. RODAPÉ (Aviso + Seta) */}
        <div className="flex flex-col items-center gap-3 mb-2 animate-fade-in-up z-10" style={{ animationDelay: "0.45s", opacity: 0 }}>
          
          {/* Aviso de Idade */}
          <p className="text-center text-[10px] sm:text-xs text-muted-foreground/50 max-w-sm px-4">
            {t('age_warning_1')}
            <button
              onClick={() => navigate("/terms")}
              className="text-white/40 underline underline-offset-2 transition-colors hover:text-accent ml-1"
            >
              {t('age_warning_2')}
            </button>{" "}
            {t('age_warning_3')}
          </p>

          {/* Seta Indicativa */}
          <div 
            onClick={scrollToContent}
            className="animate-bounce cursor-pointer text-white/20 hover:text-white transition-colors"
          >
            <ChevronDown size={24} />
          </div>
        </div>

      </div>

      {/* --- SEO SECTION (Abaixo da dobra) --- */}
      <div id="more-content" className="w-full bg-black/40 py-20 backdrop-blur-md border-t border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            
            {/* Tópico 1 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20 transition-all group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-300">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t('seo_title_1')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t('seo_desc_1')}
              </p>
            </div>

            {/* Tópico 2 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20 transition-all group-hover:scale-110 group-hover:bg-pink-500/20 group-hover:text-pink-300">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t('seo_title_2')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t('seo_desc_2')}
              </p>
            </div>

            {/* Tópico 3 */}
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left group">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20 transition-all group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">{t('seo_title_3')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
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