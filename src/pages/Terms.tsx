import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="gradient-bg min-h-screen px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à página inicial
        </button>

        {/* Content */}
        <article className="animate-fade-in-up space-y-6">
          <h1 className="text-glow-purple text-3xl font-bold tracking-tight">
            Termos de Uso
          </h1>

          <p className="text-sm text-muted-foreground">
            Última atualização: Fevereiro de 2026
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              1. Aceitação dos Termos
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ao acessar e utilizar o loouz, você concorda com estes Termos de
              Uso. Se não concordar com qualquer parte destes termos, não
              utilize a plataforma. O uso continuado do serviço constitui
              aceitação destes termos e de quaisquer atualizações futuras.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              2. Idade Mínima
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Você deve ter no mínimo <strong className="text-foreground">18 anos de idade</strong> para
              utilizar o loouz. Ao usar o serviço, você confirma que atende a
              este requisito. Não nos responsabilizamos pelo uso da plataforma
              por menores de idade.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              3. Comportamento Esperado
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Ao usar o loouz, você concorda em:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
              <li>Não enviar conteúdo ilegal, ofensivo, ameaçador ou discriminatório</li>
              <li>Não realizar assédio, bullying ou intimidação de qualquer forma</li>
              <li>Não compartilhar informações pessoais de terceiros sem consentimento</li>
              <li>Não utilizar a plataforma para fins comerciais ou spam</li>
              <li>Não tentar acessar sistemas ou dados de outros usuários</li>
              <li>Respeitar todos os usuários independentemente de origem, gênero ou crença</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              4. Privacidade e Dados
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O loouz não armazena mensagens, nomes de usuário ou qualquer dado
              pessoal de forma persistente. As conversas são temporárias e não
              ficam salvas após o encerramento. Nenhum dado é compartilhado
              com terceiros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              5. Isenção de Responsabilidade
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              O loouz é fornecido "como está", sem garantias de qualquer tipo.
              Não nos responsabilizamos pelo conteúdo gerado por outros
              usuários, pela disponibilidade contínua do serviço, ou por
              quaisquer danos diretos ou indiretos resultantes do uso da
              plataforma. Use por sua conta e risco.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">
              6. Modificações
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Reservamo-nos o direito de modificar estes termos a qualquer
              momento. As alterações entram em vigor imediatamente após a
              publicação. Recomendamos revisar os termos periodicamente.
            </p>
          </section>

          {/* Back button */}
          <div className="pt-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-border text-foreground hover:bg-secondary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar à página inicial
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Terms;
