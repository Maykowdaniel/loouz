import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: {
          //pessoas online
// Em en -> translation
          "online_now": "people online now",
          //page title
          // No i18n.ts -> en -> translation
          "page_title": "Louuz — Talk to Strangers | Free Omegle & OmeTV Alternative",
          // Index Hero
          "intro": "Chat with strangers, the new Omegle.",
          "omegle": "The best alternative to Omegle for random video and text chat with strangers.",
          "btn_enter": "Chat Texto",
          "btn_video": "Video Chat",
          "headline": "Chat with global people, the new Omegle.",
          "objective": "The best alternative to Omegle for random video and text chat with strangers.",
          "btn_text_chat": "Let's go",
          "age_warning_1": "You must be 18+ to use loouz.",
          "age_warning_2": "Read terms",
          "age_warning_3": " before continuing.",

          // SEO Titles
          "seo_title_1": "What is Louuz?",
          "seo_desc_1": "Louuz is the next-generation alternative to Omegle. Created for those who miss the thrill of meeting new people, we offer a modern, fast, and anonymous platform to connect via video or text with strangers from 190+ countries.",
          "seo_title_2": "Why is it better than Omegle?",
          "seo_desc_2": "Unlike the old platforms, Louuz is designed for 2026. We have moderation, dark mode, and topic-based rooms (like Dating, Crypto, and Stories). It's the safest way to have random video chats and make new friends instantly.",
          "seo_title_3": "100% Free & Anonymous",
          "seo_desc_3": "No registration required. No credit cards. Just pick a nickname and start talking. Whether you want a deep conversation or just to kill boredom, Louuz connects you in seconds with real people.",

          //setup
          // --- NOVAS CHAVES SETUP EN ---
          "setup": {
            "title": "Enter the Louuz",
            "description": "Choose a name and start chatting.",
            "placeholder": "Guest123",
            "continue_btn": "Continue",
            "back": "Back",
            "gender_label": "Gender",
            "gender": {
              "male": "Male",
              "female": "Female",
              "unspecified": "Unspecified"
            }
          },
          "errors": {
            "name_required": "Please choose a name.",
            "name_too_long": "Name must be max 30 chars."
          },

          // SEO EXPANSION SECTION
          "seo_exp": {
            "why_title": "Why use",
            "louuz": "Louuz?",
            "response": "Louuz has established itself as a number one alternative to Omegle in 2026, but our existence goes far beyond filling a gap left by older platforms. We are a next-generation network, designed for those who understand that the true magic of the internet lies in the spontaneity of an unexpected encounter. Our main mission is to redefine online social interactions, creating a direct bridge that brings people from all over the world closer together, breaking down geographical and cultural barriers so that a stranger becomes a new friend in a matter of seconds. Unlike services like OmeTV or Chatroulette, Louuz focuses on the purity of human connection through a modern, safe, and completely anonymous space. We believe that to meet people authentically, you don't need forms or bureaucracy; therefore, our platform requires zero registration, no login, and remains completely ad-free. We want you to immerse yourself in a video chat experience that is, above all, fun and engaging, offering the most pleasant environment possible to expand your social circle.",
            "alt_omegle": "Why is Louuz an alternative to",
            "features": {
              "f1_t": "Instant Connection", "f1_d": "No loading screens. Click 'Start' and match instantly.",
              "f2_t": "No Login Required", "f2_d": "We don't ask for email, phone number, or Facebook.",
              "f3_t": "Next-Gen Design", "f3_d": "Modern Dark Mode interface optimized for Mobile and PC.",
              "f4_t": "Global Reach", "f4_d": "Talk to strangers from USA, Brazil, Europe, and Asia."
            },
            "safe_title": "Safe Random Video Chat",
            "safe_p1": "Many users search for 'sites like Omegle' but find platforms full of bots or strict bans. At Louuz, we use advanced technology to connect real people.",
            "safe_p2": "If you miss the classic Omegle experience or want something faster than OmeTV, Louuz is the place to be. We are the 'Omegle unblocked' solution you were looking for.",
            "faq_title": "Frequently Asked Questions",
            "faq_q1": "Is Louuz a good Omegle alternative?",
            "faq_a1": "Yes! Since Omegle shut down, Louuz has become the fastest-growing alternative. We offer the same random video chat experience but with better design, mobile support, and faster connections.",
            "faq_q2": "How to get unbanned from OmeTV?",
            "faq_a2": "If you are banned from OmeTV or other sites, you don't need a VPN. Just switch to Louuz! We are a fresh platform with fair moderation. Start chatting immediately without worrying about old bans.",
            "faq_q3": "Is this video chat app safe?",
            "faq_a3": "Safety is our priority. Unlike the old Omegle, we have modern moderation systems. However, always remember to keep your personal information private when talking to strangers.",
            "footer_headline": "Louuz is for everyone - Choose your mode",
            "k1_t": "Random Video Chat", "k1_d": "Face-to-face with strangers",
            "k2_t": "Text Chat Online", "k2_d": "Fast, lightweight & anonymous",
            "k3_t": "Anonymous Chat", "k3_d": "Your identity is protected",
            "k4_t": "Omegle Alternative", "k4_d": "The modern version of the classic",
            "k5_t": "Talk to Strangers", "k5_d": "Connect globally instantly",
            "k6_t": "Sites like OmeTV", "k6_d": "Better moderation, no bans",
            "disclaimer": "Louuz is a premium online chat platform for users 18+. We promote safe and respectful interactions. The best free random chat of 2026."
          },

          //lobby

          // No i18n.ts -> resources -> en -> translation:
"lobby": {
  "welcome": "hello, {{name}}",
  "title": "Meet someone new",
  "subtitle": "Choose how you want to connect.",
  "text_chat": {
    "title": "Text chat",
    "subtitle": "Random • 1v1"
  },
  "video_chat": {
    "title": "Video Chat",
    "subtitle": "Camera On • 1v1"
  }
},
"connected": "Online",

            //text chat
           
"text_chat": {
  "status_searching": "Looking for a stranger...",
  "status_connected": "Connected",
  "status_disconnected": "Partner logged out. Click skip.",
  "partner_default": "Stranger",
  "welcome_msg": "You are talking to {{name}}. Say hi!",
  "partner_left": "{{name}} has disconnected.",
  "placeholder": "Type your message...",
  "btn_skip": "Skip"
},
"video_chat": {
  "you": "You",
  "searching": "Searching for partner...",
  "connecting": "Connecting to stranger...",
  "connected": "Connected!",
  "waiting": "Waiting for video...",
  "error": "Error: Allow camera access.",
  "btn_skip": "SKIP"
},

//salas
// --- VERSÃO EN ---
"rooms": {
  "header_hello": "Hello, {{name}}",
  "title": "public rooms",
  "subtitle": "Choose a topic and join the conversation",
  "list": {
    "global": { "name": "Global Chat", "desc": "Talk to everyone." },
    "trending": { "name": "Trending Topics", "desc": "What's viral right now. 🔥" },
    "money": { "name": "Investments", "desc": "Crypto, stocks, and business talk. 💸" },
    "nofilter": { "name": "No Filter", "desc": "Free speech and hot takes. ⚡" },
    "stories": { "name": "Real Stories", "desc": "Confessions and life experiences. 📖" },
    "area51": { "name": "Area 51", "desc": "Top secret discussions." },
    "love": { "name": "Love", "desc": "Dating, flirting and connections. ❤️" }
  }
},
        },
      },
      pt: {
        translation: {


// Em pt -> translation
"online_now": "pessoas online agora",

          //page title
          "page_title": "Louuz — Converse com estranhos | Alternativa gratuita ao Omegle e OmeTV",

          // Index Hero
          "intro": "Converse com estranhos, o novo Omegle.",
          "omegle": "A melhor alternativa ao Omegle para bate-papo aleatório por vídeo e texto com estranhos.",
          "btn_enter": "Chat Texto",
          "btn_video": "Vídeo Chat",
          "headline": "Converse com pessoas globais, o novo Omegle.",
          "objective": "A melhor alternativa ao Omegle para bate-papo aleatório por vídeo e texto com estranhos.",
          "age_warning_1": "Você precisa ter 18 anos ou mais para usar o loouz.",
          "age_warning_2": "Leia os termos",
          "age_warning_3": " antes de continuar.",

          // SEO Titles
          "seo_title_1": "O que é o Louuz?",
          "seo_desc_1": "Louuz é a alternativa de nova geração ao Omegle. Criado para quem sente falta de conhecer gente nova, oferecemos uma plataforma moderna, rápida e anônima para conectar por vídeo ou texto com estranhos de mais de 190 países.",
          "seo_title_2": "Por que é melhor que o Omegle?",
          "seo_desc_2": "Diferente das plataformas antigas, o Louuz foi feito para 2026. Temos moderação, modo noturno e salas por tópicos (como Namoro, Crypto e Histórias). É a forma mais segura de ter chats de vídeo aleatórios.",
          "seo_title_3": "100% Grátis e Anônimo",
          "seo_desc_3": "Sem cadastro. Sem cartão de crédito. Apenas escolha um apelido e comece a falar. Seja para um papo profundo ou apenas para matar o tédio, o Louuz te conecta em segundos com pessoas reais.",

          // SEO EXPANSION SECTION
          "seo_exp": {
            "why_title": "Por que usar o",
            "louuz": "Louuz?",
            "response": "O Louuz se estabeleceu como a alternativa número um ao Omegle em 2026, mas nossa existência vai muito além de preencher o vazio deixado por plataformas antigas. Somos uma rede de próxima geração, desenhada para quem entende que a verdadeira magia da internet está na espontaneidade de um encontro inesperado. Nossa missão principal é redefinir as interações sociais online, criando uma ponte direta que aproxima pessoas de todo o mundo, quebrando barreiras geográficas e culturais para que um estranho se torne um novo amigo em questão de segundos. Diferente de serviços como OmeTV ou Chatroulette, o Louuz foca na pureza da conexão humana através de um espaço moderno, seguro e completamente anônimo. Acreditamos que, para conhecer pessoas de forma autêntica, você não precisa de formulários ou burocracia; por isso, nossa plataforma exige zero registro e permanece totalmente livre de anúncios.",
            "alt_omegle": "Por que o Louuz é uma alternativa ao",
            "features": {
              "f1_t": "Conexão Instantânea", "f1_d": "Sem telas de espera. Clique em 'Começar' e conecte-se na hora.",
              "f2_t": "Sem Necessidade de Login", "f2_d": "Não pedimos e-mail, número de telefone ou redes sociais.",
              "f3_t": "Design de Nova Geração", "f3_d": "Interface moderna em Dark Mode otimizada para Celular e PC.",
              "f4_t": "Alcance Global", "f4_d": "Fale com estranhos dos EUA, Brasil, Europa e Ásia."
            },
            "safe_title": "Chat de Vídeo Aleatório Seguro",
            "safe_p1": "Muitos usuários buscam por 'sites como Omegle', mas encontram plataformas cheias de bots ou banimentos rigorosos. No Louuz, usamos tecnologia avançada para conectar pessoas reais.",
            "safe_p2": "Se você sente falta da experiência clássica do Omegle ou quer algo mais rápido que o OmeTV, o Louuz é o lugar certo. Somos a solução 'Omegle desbloqueado' que você procurava.",
            "faq_title": "Perguntas Frequentes",
            "faq_q1": "O Louuz é uma boa alternativa ao Omegle?",
            "faq_a1": "Sim! Desde que o Omegle fechou, o Louuz se tornou a alternativa que mais cresce. Oferecemos a mesma experiência de chat aleatório, mas com melhor design e conexões mais rápidas.",
            "faq_q2": "Como ser desbanido do OmeTV?",
            "faq_a2": "Se você foi banido do OmeTV ou outros sites, não precisa de VPN. Basta mudar para o Louuz! Somos uma plataforma nova com moderação justa.",
            "faq_q3": "Este app de vídeo chat é seguro?",
            "faq_a3": "Segurança é nossa prioridade. Diferente do antigo Omegle, temos sistemas modernos de moderação. Lembre-se sempre de manter seus dados pessoais privados.",
            "footer_headline": "O Louuz é para todos - Escolha o seu modo",
            "k1_t": "Chat de Vídeo Aleatório", "k1_d": "Frente a frente com estranhos",
            "k2_t": "Chat de Texto Online", "k2_d": "Rápido, leve e anônimo",
            "k3_t": "Chat Anônimo", "k3_d": "Sua identidade está protegida",
            "k4_t": "Alternativa ao Omegle", "k4_d": "A versão moderna do clássico",
            "k5_t": "Falar com Estranhos", "k5_d": "Conecte-se globalmente instantaneamente",
            "k6_t": "Sites como OmeTV", "k6_d": "Melhor moderação, sem banimentos",
            "disclaimer": "O Louuz é uma plataforma premium para maiores de 18 anos. Promovemos interações respeitosas. O melhor chat gratuito de 2026."
          },

          //setup
          // --- NOVAS CHAVES SETUP PT ---
          "setup": {
            "title": "Entrar no Louuz",
            "description": "Escolha um nome e comece a conversar.",
            "placeholder": "Visitante123",
            "continue_btn": "Continuar",
            "back": "Voltar",
            "gender_label": "Gênero",
            "gender": {
              "male": "Masculino",
              "female": "Feminino",
              "unspecified": "Não especificado"
            }
          },
          "errors": {
            "name_required": "Por favor, escolha um nome.",
            "name_too_long": "O nome deve ter no máximo 30 caracteres."
          },

          //lobby
          // No i18n.ts -> resources -> pt -> translation:
"lobby": {
  "welcome": "olá, {{name}}",
  "title": "Conheça alguém novo",
  "subtitle": "Escolha como se quer conectar.",
  "text_chat": {
    "title": "Chat de Texto",
    "subtitle": "Aleatório • 1v1"
  },
  "video_chat": {
    "title": "Chat de Vídeo",
    "subtitle": "Câmara Ligada • 1v1"
  }
},
"connected": "Online",
"back":"Voltar",
"btn_skip":"Pular",
// --- VERSÃO PT ---
"text_chat": {
  "status_searching": "À procura de um estranho...",
  "status_connected": "Conectado",
  "status_disconnected": "O parceiro saiu. Clique em pular.",
  "partner_default": "Estranho",
  "welcome_msg": "Estás a falar com {{name}}. Diz olá!",
  "partner_left": "{{name}} desconectou-se.",
  "placeholder": "Digita a tua mensagem...",
  "btn_skip": "Pular"
},
"video_chat": {
  "you": "Vo ê",
  "video_searching": "Procurando Alguém...",
  "connecting": "A conectar com estranho...",
  "connected": "Conectado!",
  "video_waiting": "A aguardar vídeo...",
  "error": "Erro: Permite o acesso à câmara.",
  "btn_skip": "PULAR"
},

//salas 
// --- VERSÃO PT ---
"rooms": {
  "header_hello": "Olá, {{name}}",
  "title": "salas públicas",
  "subtitle": "Escolha um tópico e entre na conversa",
  "list": {
    "global": { "name": "Chat Global", "desc": "Fala com toda a gente." },
    "trending": { "name": "Assuntos do Momento", "desc": "O que está a viralizar agora. 🔥" },
    "money": { "name": "Investimentos", "desc": "Crypto, ações e papo de negócios. 💸" },
    "nofilter": { "name": "Sem Filtro", "desc": "Liberdade de expressão e debates quentes. ⚡" },
    "stories": { "name": "Relatos Reais", "desc": "Confissões e experiências de vida. 📖" },
    "area51": { "name": "Área 51", "desc": "Discussões ultrassecretas." },
    "love": { "name": "Amor", "desc": "Encontros, paquera e conexões. ❤️" }
  }
}


        }
      }
    }
  });
  

export default i18n;