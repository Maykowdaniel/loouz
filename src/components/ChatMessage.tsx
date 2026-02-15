interface ChatMessageProps {
  sender: "user" | "stranger" | "system";
  senderName: string;
  senderCountry?: string;
  senderGender?: "male" | "female" | "unspecified"; // Recebe o gênero
  text: string;
}

const getFlagUrl = (countryCode?: string) => {
  if (!countryCode || countryCode === 'UN' || countryCode.length !== 2) return null;
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
};

// Gera avatar cartoon estilo "Avataaars"
const getAvatarUrl = (name: string, gender?: string) => {
  if (!gender || gender === 'unspecified') return null;
  
  // Mapeia nossos gêneros para os estilos do DiceBear
  // Nota: DiceBear não tem filtro estrito de "boy/girl", mas podemos usar "seed" diferentes
  // ou coleções diferentes. Vamos usar a coleção 'avataaars' que é unissex mas muito boa,
  // ou 'adventurer' que é legal. 
  // Para diferenciar bem, vamos usar 'micah' ou 'avataaars' com seeds personalizados.
  
  // Truque simples: Adicionar prefixo ao seed para variar o estilo visual
  const seed = gender === 'male' ? `boy-${name}` : `girl-${name}`;
  
  // Retorna URL da API DiceBear
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=${gender === 'male' ? 'b6e3f4' : 'ffdfbf'}`;
};

const ChatMessage = ({ sender, senderName, senderCountry, senderGender, text }: ChatMessageProps) => {
  const isUser = sender === "user";
  const isSystem = sender === "system";

  if (isSystem) {
    return (
      <div className="flex w-full justify-center py-2 animate-fade-in">
        <span className="rounded-full bg-secondary/50 px-3 py-1 text-[10px] text-muted-foreground/60 backdrop-blur-sm">
          {text}
        </span>
      </div>
    );
  }

  const flagUrl = getFlagUrl(senderCountry);
  const avatarUrl = getAvatarUrl(senderName, senderGender);

  return (
    <div className={`animate-slide-in-bottom flex w-full gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      
      {/* Avatar do Estranho (Lado Esquerdo) - Só mostra se tiver gênero */}
      {!isUser && avatarUrl && (
        <div className="flex flex-col justify-end">
           <img 
             src={avatarUrl} 
             alt="Avatar" 
             className="h-8 w-8 rounded-full bg-secondary border border-border shadow-sm"
           />
        </div>
      )}

      {/* Balão da Mensagem */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[65%] ${
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-secondary text-secondary-foreground"
        }`}
      >
        <div
          className={`mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide ${
            isUser ? "text-primary-foreground/70 flex-row-reverse" : "text-accent"
          }`}
        >
          <span>{senderName}</span>
          {flagUrl && (
            <img 
              src={flagUrl} 
              alt={senderCountry} 
              className="h-3 w-4 rounded-[2px] object-cover shadow-sm"
            />
          )}
        </div>
        <p className="leading-relaxed break-words">{text}</p>
      </div>

      {/* Avatar do Usuário (Lado Direito) - Só mostra se tiver gênero */}
      {isUser && avatarUrl && (
        <div className="flex flex-col justify-end">
           <img 
             src={avatarUrl} 
             alt="Me" 
             className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 shadow-sm"
           />
        </div>
      )}

    </div>
  );
};

export default ChatMessage;