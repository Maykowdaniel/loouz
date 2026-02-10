import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Globe, Shield, Zap, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const scrollToContent = () => {
    document.getElementById('more-content')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="gradient-bg flex flex-col">
      
      {/* --- HERO SECTION (100% da Tela) --- */}
      {/* h-[100dvh] garante que ocupe a altura exata da tela do celular/pc */}
      <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center px-4">
        
        {/* Logo Principal - Centralizado e Grande */}
        <div className="animate-fade-in-up mb-8 scale-110 sm:scale-125">
          <h1 className="text-glow-purple text-7xl font-black tracking-tighter sm:text-8xl md:text-9xl">
            lo<span className="text-accent">uu</span>z
          </h1>
        </div>

        {/* Título Principal */}
        <h2 
          className="animate-fade-in-up mb-6 max-w-4xl text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-br from-white via-purple-50 to-purple-400 bg-clip-text text-transparent drop-shadow-sm leading-tight"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          {t('intro')}
        </h2>

        {/* Subtítulo */}
        <p
          className="animate-fade-in-up mb-12 max-w-lg text-center text-lg text-zinc-400 sm:text-xl font-medium"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {t('omegle')}
        </p>

        {/* Botão de Ação (Hero) */}
        <div
          className="animate-fade-in-up mb-8"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <Button
            onClick={() => navigate("/setup")}
            size="lg"
            className="gradient-btn hover:box-glow-purple h-16 border-0 px-12 text-2xl font-bold text-primary-foreground transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-900/30 rounded-full"
          >
            <MessageSquare className="mr-3 h-7 w-7" />
            {t('btn_text_chat')}
          </Button>
        </div>

        {/* Aviso de Idade e Termos */}
        <p
          className="animate-fade-in-up absolute bottom-20 text-center text-xs text-muted-foreground/60"
          style={{ animationDelay: "0.45s", opacity: 0 }}
        >
          {t('age_warning_1')}
          <button
            onClick={() => navigate("/terms")}
            className="text-white/40 underline underline-offset-2 transition-colors hover:text-accent ml-1"
          >
            {t('age_warning_2')}
          </button>{" "}
          {t('age_warning_3')}
        </p>

        {/* Seta indicando rolagem (Pula para chamar atenção) */}
        <div 
          onClick={scrollToContent}
          className="absolute bottom-6 animate-bounce cursor-pointer text-white/20 hover:text-white transition-colors"
        >
          <ChevronDown size={32} />
        </div>
      </div>

      {/* --- SEO SECTION (Abaixo da dobra - Tópicos Limpos) --- */}
      {/* Sem caixas, apenas texto e ícones flutuando no fundo */}
      <div id="more-content" className="w-full bg-black/20 py-24 backdrop-blur-sm">
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