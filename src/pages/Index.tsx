import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="gradient-bg flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="animate-fade-in-up mb-6">
        <h1 className="text-glow-purple text-6xl font-black tracking-tighter sm:text-7xl md:text-8xl">
          l<span className="text-accent">oo</span>uz
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="animate-fade-in-up mb-10 max-w-md text-center text-lg text-muted-foreground sm:text-xl"
        style={{ animationDelay: "0.15s", opacity: 0 }}
      >
        Converse com pessoas globais, o novo Omegle.
      </p>

      {/* CTA Button */}
      <div
        className="animate-fade-in-up mb-8"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      >
        <Button
          onClick={() => navigate("/setup")}
          size="lg"
          className="gradient-btn hover:box-glow-purple border-0 px-8 py-6 text-lg font-semibold text-primary-foreground transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Bate-papo por texto
        </Button>
      </div>

      {/* Age warning */}
      <p
        className="animate-fade-in-up max-w-sm text-center text-xs text-muted-foreground"
        style={{ animationDelay: "0.45s", opacity: 0 }}
      >
        Você precisa ter 18 anos ou mais para usar o loouz.{" "}
        <button
          onClick={() => navigate("/terms")}
          className="text-accent underline underline-offset-2 transition-colors hover:text-primary"
        >
          Leia os termos
        </button>{" "}
        antes de continuar.
      </p>
    </div>
  );
};

export default Index;
