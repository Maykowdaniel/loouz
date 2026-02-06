

# loouz — Plataforma de Bate-papo Global por Texto

## Visão Geral
Site moderno e minimalista com tema escuro, gradientes e acentos neon, inspirado no Omegle. Um MVP focado em UX e estrutura de código limpa, pronto para evolução futura com WebSocket/Socket.IO.

---

## Páginas e Fluxo

### 1. Página Inicial (Home)
- Fundo escuro com gradientes sutis (roxo/azul)
- Logo estilizada "loouz" com efeito de brilho/neon
- Frase em destaque: *"Converse com pessoas globais, o novo Omegle."*
- Botão principal chamativo: **"Bate-papo por texto"**
- Aviso de idade mínima (18+) com link para os Termos de Uso
- Design responsivo para desktop e mobile
- Animações sutis de entrada para os elementos

### 2. Tela de Setup (Nome e Sexo)
- Tela intermediária que aparece ao clicar em "Bate-papo por texto"
- Campo de texto para nome do usuário (com placeholder "Guest123")
- Seleção de sexo com 3 opções estilizadas: Masculino, Feminino, Prefiro não dizer
- Botão **"Entrar no chat"**
- Validação simples (nome obrigatório)
- Sem autenticação, sem persistência de dados

### 3. Tela de Chat
- Layout de chat simples e elegante estilo Omegle
- Nome do usuário exibido no topo
- Indicador de "Stranger" (estranho conectado)
- Área de mensagens com balões diferenciados (usuário vs. estranho)
- Campo de texto + botão enviar (com suporte a Enter)
- Botão **"Próximo"** para simular busca de novo parceiro (com animação de "buscando...")
- **Simulação com bot**: ao enviar mensagem, um "estranho" responde automaticamente após 1-3 segundos com mensagens variadas e genéricas
- Animação de "digitando..." antes das respostas do bot
- Botão de desconectar para voltar à Home

### 4. Página de Termos de Uso
- Página estática com termos básicos reais
- Regras de idade mínima, comportamento esperado, isenção de responsabilidade
- Link para voltar à Home

---

## Design e Estilo
- **Dark theme** com fundo muito escuro e gradientes sutis (roxo, azul)
- Acentos em cores vibrantes/neon para botões e elementos interativos
- Tipografia moderna e limpa
- Bordas suaves e sombras com glow sutil
- Totalmente responsivo (mobile-first)
- Animações e transições suaves entre páginas

---

## Estrutura de Código
- Componentes bem organizados e separados
- Rotas: `/` (Home), `/setup` (Nome/Sexo), `/chat` (Chat), `/terms` (Termos)
- Código comentado e preparado para integração futura com WebSocket
- Estado do usuário gerenciado via React state (sem persistência)

