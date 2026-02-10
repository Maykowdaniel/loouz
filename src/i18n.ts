import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    },
    resources: {
      en: {
        translation: {
          // Index Hero
          "intro": "Chat with strangers, the new Omegle.",
          "omegle": "The best alternative to Omegle for random video and text chat with strangers.",
          "btn_enter": "Enter Text Chat",
          "btn_video": "Video Chat (Random)",
          "headline": "Chat with global people, the new Omegle.",
          "objective": "The best alternative to Omegle for random video and text chat with strangers.",
          "btn_text_chat": "Let's go",
          "age_warning_1": "You must be 18+ to use loouz.",
          "age_warning_2": "Read terms",
          "age_warning_3": " before continuing.",

          // --- NOVOS TEXTOS DE SEO (ADICIONADOS) ---
          "seo_title_1": "What is Louuz?",
          "seo_desc_1": "Louuz is the next-generation alternative to Omegle. Created for those who miss the thrill of meeting new people, we offer a modern, fast, and anonymous platform to connect via video or text with strangers from 190+ countries.",
          
          "seo_title_2": "Why is it better than Omegle?",
          "seo_desc_2": "Unlike the old platforms, Louuz is designed for 2026. We have moderation, dark mode, and topic-based rooms (like Dating, Crypto, and Stories). It's the safest way to have random video chats and make new friends instantly.",
          
          "seo_title_3": "100% Free & Anonymous",
          "seo_desc_3": "No registration required. No credit cards. Just pick a nickname and start talking. Whether you want a deep conversation or just to kill boredom, Louuz connects you in seconds with real people.",
          // ------------------------------------------

          // Setup
          "your_name":"Your name",
          "back": "back",
          "enter_name": "Choose a name and start chatting.",
          "gender_label": "Gender",
          "male": "Male",
          "female": "Female",
          "unspecified": "Prefer not to say",
          "enter_btn": "Enter Chat",
          "error_name": "Please choose a name.",
          "error_name_len": "Name must be max 30 chars.",
          
          // LOBBY
          "title": "Meet someone new",
          "connect": "Choose how you want to connect.",
          "text_chat_op":"Text chat",
          "tipe_text" :"Random • 1v1",
          "text_video_op":"Text chat",
          "tipe_video" :"Camera On • 1v1",
          
          // ROOMS
          "rooms_title": "Available Rooms",
          "logged_as": "Logged as",
          "logout": "Exit",
          "room_global": "Global Chat",
          "desc_global": "Talk to everyone.",
          "room_trending": "Trending Topics",
          "desc_trending": "What's viral right now. 🔥",
          "room_invest": "Investments",
          "desc_invest": "Crypto, stocks, and business talk. 💸",
          "room_nofilter": "No Filter",
          "desc_nofilter": "Free speech and hot takes. ⚡",
          "room_stories": "Real Stories",
          "desc_stories": "Confessions and life experiences. 📖",
          "room_area51": "Area 51",
          "desc_area51": "Top secret discussions.",
          "room_love": "Love",
          "desc_love": "Dating, flirting and connections. ❤️",

          // Chat
          "connected": "Online",
          "connecting": "Connecting...",
          "type_placeholder": "Type your message...",
          "welcome_title": "Welcome to {{room}}!",
          "welcome_desc": "Send a message to start.",
          "system_joined": "joined the room.",
          "system_left": "left the room.",
          
          // VIDEO
          "video_searching": "Searching for partner...",
          "video_connecting": "Connecting to stranger...",
          "video_connected": "Connected!",
          "video_waiting": "Waiting for video...",
          "video_error": "Error: Allow camera access.",
          "btn_skip": "SKIP",
          "btn_stop": "STOP",
        }
      },
      pt: {
        translation: {
          // Index Hero
          "intro": "Converse com estranhos, o novo Omegle.",
          "omegle": "A melhor alternativa ao Omegle para bate-papo aleatório por vídeo e texto com estranhos.",
          "btn_enter": "Entrar no Chat de Texto",
          "btn_video": "Vídeo Chat (Aleatório)",
          "headline": "Converse com pessoas globais, o novo Omegle.",
          "objective": "A melhor alternativa ao Omegle para bate-papo aleatório por vídeo e texto com estranhos.",
          "btn_text_chat": "Começar",
          "age_warning_1": "Você precisa ter 18 anos ou mais para usar o loouz.",
          "age_warning_2": "Leia os termos",
          "age_warning_3": " antes de continuar.",

          // --- NOVOS TEXTOS DE SEO (ADICIONADOS) ---
          "seo_title_1": "O que é o Louuz?",
          "seo_desc_1": "Louuz é a alternativa de nova geração ao Omegle. Criado para quem sente falta de conhecer gente nova, oferecemos uma plataforma moderna, rápida e anônima para conectar por vídeo ou texto com estranhos de mais de 190 países.",
          
          "seo_title_2": "Por que é melhor que o Omegle?",
          "seo_desc_2": "Diferente das plataformas antigas, o Louuz foi feito para 2026. Temos moderação, modo noturno e salas por tópicos (como Namoro, Crypto e Histórias). É a forma mais segura de ter chats de vídeo aleatórios.",
          
          "seo_title_3": "100% Grátis e Anônimo",
          "seo_desc_3": "Sem cadastro. Sem cartão de crédito. Apenas escolha um apelido e comece a falar. Seja para um papo profundo ou apenas para matar o tédio, o Louuz te conecta em segundos com pessoas reais.",
          // ------------------------------------------

          // Setup
          "your_name":"Seu nome",
          "back": "voltar",
          "enter_name": "Escolha um nome e comece a conversar",
          "gender_label": "Sexo",
          "male": "Masculino",
          "female": "Feminino",
          "unspecified": "Prefiro não dizer",
          "enter_btn": "Entrar no Chat",
          "error_name": "Por favor, escolha um nome.",
          "error_name_len": "O nome deve ter no máximo 30 caracteres.",
          
          // LOBBY
          "title": "Conheça alguém novo",
          "connect": "Escolha como você quer se conectar.",
          "text_chat_op":"Chat de Texto",
          "tipe_text" :"Aleatório • 1v1",
          "text_video_op":"Bate papo de vídeo",
          "tipe_video" :"Câmera Ligada • 1v1",

          // ROOMS
          "rooms_title": "Salas Disponíveis",
          "logged_as": "Logado como",
          "logout": "Sair",
          "room_global": "Bate-papo global",
          "desc_global": "Sala de bate-papo global",
          "room_trending": "Assuntos do Momento",
          "desc_trending": "O que está viralizando agora. 🔥",
          "room_invest": "Investimentos",
          "desc_invest": "Crypto, ações e negócios. 💸",
          "room_nofilter": "Sem Filtro",
          "desc_nofilter": "Opiniões sinceras e debates livres. ⚡",
          "room_stories": "Relatos de Pessoas",
          "desc_stories": "Desabafos, segredos e histórias reais. 📖",
          "room_area51": "Área 51",
          "desc_area51": "Zona de discussão ultrassecreta",
          "room_love": "Amor",
          "desc_love": "Converse, flerta e crie conexões reais em um ambiente acolhedor. ❤️",

          // Chat
          "connected": "Online",
          "connecting": "Conectando...",
          "type_placeholder": "Digite sua mensagem...",
          "welcome_title": "Bem-vindo à sala {{room}}!",
          "welcome_desc": "Envie uma mensagem para começar.",
          "system_joined": "entrou na sala.",
          "system_left": "saiu da sala.",
          
          // VIDEO
          "video_searching": "Procurando alguém...",
          "video_connecting": "Conectando com estranho...",
          "video_connected": "Conectado!",
          "video_waiting": "Esperando vídeo...",
          "video_error": "Erro: Permita o uso da câmera.",
          "btn_skip": "PULAR",
          "btn_stop": "PARAR",
        }
      }
    }
  });

export default i18n;