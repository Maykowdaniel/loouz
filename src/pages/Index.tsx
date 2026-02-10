import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Globe, Shield, Zap } from "lucide-react"; // Adicionei icones novos
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="gradient-bg flex min-h-screen flex-col">
      
      {/* --- HERO SECTION (O que o usuário vê primeiro) --- */}
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
        {/* Logo Principal */}
        <div className="animate-fade-in-up mb-6">
          <h1 className="text-glow-purple text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl">
            lo<span className="text-accent">uu</span>z
          </h1>
        </div>

        {/* Título Principal */}
        <h2 
          className="animate-fade-in-up mb-4 max-w-3xl text-center text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-br from-white via-purple-50 to-purple-400 bg-clip-text text-transparent drop-shadow-sm"
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

        {/* Botão de Ação */}
        <div
          className="animate-fade-in-up mb-8"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <Button
            onClick={() => navigate("/setup")}
            size="lg"
            className="gradient-btn hover:box-glow-purple border-0 px-10 py-7 text-xl font-bold text-primary-foreground transition-all duration-300 hover:scale-105 shadow-xl shadow-purple-900/20"
          >
            <MessageSquare className="mr-3 h-6 w-6" />
            {t('btn_text_chat')}
          </Button>
        </div>

        {/* Aviso de Idade */}
        <p
          className="animate-fade-in-up max-w-sm text-center text-xs text-muted-foreground"
          style={{ animationDelay: "0.45s", opacity: 0 }}
        >
          {t('age_warning_1')}
          <button
            onClick={() => navigate("/terms")}
            className="text-accent underline underline-offset-2 transition-colors hover:text-primary ml-1"
          >
            {t('age_warning_2')}
          </button>{" "}
          {t('age_warning_3')}
        </p>
      </div>

      {/* --- SEO SECTION (Para o Google e Usuários Curiosos) --- */}
      <div className="w-full bg-black/20 py-16 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            
            {/* Bloco 1: O que é */}
            <div className="rounded-2xl border border-purple-500/10 bg-purple-900/5 p-6 transition-all hover:bg-purple-900/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{t('seo_title_1')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t('seo_desc_1')}
              </p>
            </div>

            {/* Bloco 2: Por que é melhor */}
            <div className="rounded-2xl border border-purple-500/10 bg-purple-900/5 p-6 transition-all hover:bg-purple-900/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/20 text-pink-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{t('seo_title_2')}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {t('seo_desc_2')}
              </p>
            </div>

            {/* Bloco 3: Segurança */}
            <div className="rounded-2xl border border-purple-500/10 bg-purple-900/5 p-6 transition-all hover:bg-purple-900/10">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{t('seo_title_3')}</h3>
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