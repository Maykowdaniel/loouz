import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="gradient-bg flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo Principal */}
      <div className="animate-fade-in-up mb-6">
        <h1 className="text-glow-purple text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl">
          lo<span className="text-accent">uu</span>z
        </h1>
      </div>

      {/* --- TÍTULO COM FONTE NOVA (Gradiente e Mais Robusta) --- */}
      <h2 
        className="animate-fade-in-up mb-4 max-w-3xl text-center text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-br from-white via-purple-50 to-purple-400 bg-clip-text text-transparent drop-shadow-sm"
        style={{ animationDelay: "0.1s", opacity: 0 }}
      >
        Converse com estranhos, o novo Omegle
      </h2>

      {/* Subtítulo */}
      <p
        className="animate-fade-in-up mb-10 max-w-lg text-center text-lg text-zinc-400 sm:text-xl font-medium"
        style={{ animationDelay: "0.2s", opacity: 0 }}
      >
        A melhor alternativa ao Omegle para bate-papo aleatório por vídeo e texto com estranhos.
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
  );
};

export default Index;