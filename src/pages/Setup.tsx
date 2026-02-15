import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

type Gender = "male" | "female" | "unspecified";

const Setup = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [error, setError] = useState("");

  // Usamos labelKey para buscar a tradução correta no i18n
  const genderOptions: { value: Gender; labelKey: string; icon: string }[] = [
    { value: "male", labelKey: "setup.gender.male", icon: "♂" },
    { value: "female", labelKey: "setup.gender.female", icon: "♀" },
    { value: "unspecified", labelKey: "setup.gender.unspecified", icon: "—" },
  ];

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError(t("errors.name_required")); // Tradução de erro
      return;
    }
    if (trimmed.length > 30) {
      setError(t("errors.name_too_long")); // Tradução de erro
      return;
    }

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
        {t("setup.back")}
      </button>

      <div className="animate-fade-in-up w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-glow-purple mb-2 text-3xl font-bold tracking-tight">
            {t("setup.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("setup.description")}
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-6 rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm">
          
          {/* Input de Nome */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm text-foreground">
              <User className="mr-1 inline h-3.5 w-3.5" />
              {t("your_name")}
            </Label>
            <Input
              id="username"
              placeholder={t("setup.placeholder")}
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
            <Label className="text-sm text-foreground">{t("setup.gender_label")}</Label>
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
                  {t(opt.labelKey)} {/* Aqui a tradução acontece no loop */}
                </button>
              ))}
            </div>
          </div>

          {/* Botão de Continuar */}
          <div className="pt-2">
            <Button
              onClick={handleContinue}
              className="gradient-btn w-full border-0 py-6 font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:box-glow-purple"
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t("setup.continue_btn")}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Setup;