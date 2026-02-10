import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, LogIn } from "lucide-react"; // LogIn para o botão entrar
import { useTranslation } from "react-i18next";

type Gender = "male" | "female" | "unspecified";

const Setup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [error, setError] = useState("");

  const genderOptions: { value: Gender; label: string; icon: string }[] = [
    { value: "male", label: t('male'), icon: "♂" },
    { value: "female", label: t('female'), icon: "♀" },
    { value: "unspecified", label: t('unspecified'), icon: "—" },
  ];

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please choose a name."); 
      return;
    }
    if (trimmed.length > 30) {
      setError("Name must be max 30 chars.");
      return;
    }

    // Leva para o "Lar" (Lobby) com os dados do usuário
    navigate("/lobby", { state: { name: trimmed, gender } });
  };

  return (
    <div className="gradient-bg flex min-h-screen flex-col items-center justify-center px-4">
      {/* Botão Voltar */}
      <button
        onClick={() => navigate("/")}
        className="animate-fade-in absolute left-4 top-4 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="animate-fade-in-up w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-glow-purple mb-2 text-3xl font-bold tracking-tight">
            Enter the louuz
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose a name and start chatting.
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          
          {/* Input de Nome */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm text-foreground">
              <User className="mr-1 inline h-3.5 w-3.5" />
              Your name
            </Label>
            <Input
              id="username"
              placeholder="Guest123"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              maxLength={30}
              className="border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            {error && (
              <p className="animate-slide-in-bottom text-xs text-destructive">
                {error}
              </p>
            )}
          </div>

          {/* Seleção de Gênero */}
          <div className="space-y-2">
            <Label className="text-sm text-foreground">{t('gender_label')}</Label>
            <div className="grid grid-cols-3 gap-2">
              {genderOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setGender(opt.value)}
                  className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                    gender === opt.value
                      ? "border-primary bg-primary/10 text-primary box-glow-purple"
                      : "border-border bg-background/30 text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mb-1 block text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ÚNICO BOTÃO DE CONTINUAR */}
          <div className="pt-2">
            <Button
              onClick={handleContinue}
              className="gradient-btn w-full border-0 py-6 font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:box-glow-purple"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Continue {/* Pode usar t('continue') se tiver tradução */}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Setup;