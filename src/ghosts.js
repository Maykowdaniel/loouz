// ghosts.js - Simulação de Tráfego para SidePanel e Rooms
import { io } from "socket.io-client";

// --- CONFIGURAÇÃO ---
const SERVER_URL = "https://loouz-oficial-final.onrender.com";
const TOTAL_BOTS = 40;

const countries = [
    "US", "BR", "GB", "CA", "DE", "FR", "IT", "ES", "MX", "IN", "KR", "JP", "RU", "AU"
];

const countryToLang = {
    "US": "en",
    "BR": "pt",
    "GB": "en",
    "CA": "en",
    "DE": "de",
    "FR": "fr",
    "IT": "it",
    "ES": "es",
    "MX": "es",
    "IN": "en", // Usando inglês para simplicidade, mas pode adicionar hindi se necessário
    "KR": "ko",
    "JP": "ja",
    "RU": "ru",
    "AU": "en"
};

const names = [
    "Sarah_US", "Mike88", "LonelyBoy", "Anna_K", "Pedro_BR", "CryptoKing", "SadGirl22",
    "JohnDoe", "Vivi_L", "GamerX", "Alex_Fr", "Maria_S", "Tored_Guy", "ChillVibes",
    "Emma_W", "Lukas_Ger", "Jap_User", "Kim_Lee", "Nina_R", "Carlos_Mx",
    "Stranger001", "Anon_User", "WebMaster", "Love_Seeker", "Invest_Bro", "Tech_Guy",
    "MusicLover", "Artist_X", "Dreamer", "NightOwl", "Sunshine", "Moonlight",
    "AlphaWolf", "BetaTester", "Charlie", "DeltaForce", "Echo_Loc", "Foxtrot",
    "Hans_M", "Pierre_P", "Sakura", "Raj_Ind", "Dimitri", "Bella_It", "Sofia_Es",
    "Liam_UK", "Noah_US", "Oliver", "Elijah", "James", "William", "Benjamin",
    "Lucas", "Henry", "Theodore", "Jack", "Levi", "Alexander", "Jackson",
    "Mateo", "Daniel", "Michael", "Mason", "Sebastian", "Ethan", "Logan",
    "Owen", "Samuel", "Jacob", "Asher", "Aiden", "John", "Joseph",
    "Wyatt", "David", "Leo", "Luke", "Julian", "Hudson", "Grayson",
    "Matthew", "Ezra", "Gabriel", "Carter", "Isaac", "Jayden", "Luca",
    "Anthony", "Dylan", "Lincoln", "Thomas", "Maverick", "Elias", "Josiah",
    "Charles", "Caleb", "Christopher", "Ezekiel", "Miles", "Jaxon", "Isaiah",
    "Andrew", "Joshua", "Nathan", "Nolan", "Adrian", "Cameron", "Santiago",
    "Eli", "Aaron", "Ryan", "Angel", "Cooper", "Waylon", "Easton", "Kai"
];

// --- VOCABULÁRIO EXPANDIDO E POR IDIOMA ---
// Adicionei muitos mais vocabulários, com variações para soar mais humano (emojis, gírias, erros de digitação ocasionais).
// Cada sala agora tem sub-objetos por idioma. Idiomas suportados: en (inglês), pt (português), de (alemão), fr (francês), it (italiano), es (espanhol), ko (coreano), ja (japonês), ru (russo).
// Para idiomas não latinos, usei transcrições romanizadas para simplicidade (pode ajustar para caracteres nativos se o servidor suportar).
// Para tornar mais humano: adicionei variações como "lol", "haha", emojis, perguntas abertas, respostas curtas, etc.
const vocabulario = {
    global: {
        en: [
            "Hello everyone!", "Anyone from USA here?", "So bored right now...", "Where are you guys from?",
            "Hi from Brazil!", "This site is better than Omegle", "Anyone wanna video chat?",
            "Is this real?", "Looking for friends", "What time is it for you?", "I should be studying lol",
            "Cool design here", "Anyone from Europe?", "I miss Omegle but this is cool", "Hello from Germany",
            "Any girls here?", "Im from London", "Bored af", "Who wants to talk?", "M or F?",
            "Video?", "Skip", "Next", "Lol", "Wtf", "Cool", "Hi", "Hello", "What's up?", "Hey there!",
            "Feeling lonely tonight?", "Anyone up for a chat?", "This app is fun", "Haha that's funny",
            "What are you doing right now?", "Nice to meet you all", "Peace out", "Gotta go soon",
            "Anyone play games?", "Favorite movie?", "Weather sucks here", "Just chilling", "Sup dude?",
            "Missed the old chat sites", "This is awesome!", "Anyone from Asia?", "Good morning everyone",
            "Good night folks", "Let's talk about life", "I'm new here", "Help me kill time",
            "Boring day at work", "School is overrated lol", "Weekend plans?", "Travel stories?",
            "Food recommendations?", "Music tastes?", "Books anyone?", "Sports fans here?"
        ],
        pt: [
            "Olá galera!", "Alguém do Brasil aqui?", "Tô tão entediado agora...", "De onde vocês são?",
            "Oi do Brasil!", "Esse site é melhor que Omegle", "Alguém quer vídeo chat?",
            "Isso é real?", "Procurando amigos", "Que horas são pra você?", "Eu devia estar estudando kkk",
            "Design legal aqui", "Alguém da Europa?", "Saudades do Omegle mas isso é legal", "Olá da Alemanha",
            "Alguma garota aqui?", "Sou de Londres", "Entediado pra caramba", "Quem quer conversar?", "H ou M?",
            "Vídeo?", "Pular", "Próximo", "Kkk", "Que merda", "Legal", "Oi", "Olá", "E aí?", "Ei!",
            "Me sentindo sozinho hoje à noite?", "Alguém afim de bater papo?", "Esse app é divertido",
            "Haha isso é engraçado", "O que você tá fazendo agora?", "Prazer conhecer vocês",
            "Falou", "Tenho que ir logo", "Alguém joga games?", "Filme favorito?", "Tempo ruim aqui",
            "Só relaxando", "E aí cara?", "Saudades dos sites de chat antigos", "Isso é incrível!",
            "Alguém da Ásia?", "Bom dia todo mundo", "Boa noite pessoal", "Vamos falar da vida",
            "Sou novo aqui", "Me ajuda a matar o tempo", "Dia chato no trabalho", "Escola é superestimada kkk",
            "Planos pro fim de semana?", "Histórias de viagem?", "Recomendações de comida?", "Gostos musicais?",
            "Livros alguém?", "Fãs de esportes aqui?", "Tô no tédio total", "Bora trocar ideia?",
            "Que dia preguiçoso", "Alguém pra desabafar?", "Ri alto aqui kkk", "Valeu pela conversa"
        ],
        de: [
            "Hallo alle!", "Jemand aus den USA hier?", "So langweilig gerade...", "Woher kommt ihr?",
            "Hallo aus Brasilien!", "Diese Seite ist besser als Omegle", "Jemand für Video-Chat?",
            "Ist das echt?", "Suche Freunde", "Wie spät ist es bei dir?", "Ich sollte lernen lol",
            "Cooles Design hier", "Jemand aus Europa?", "Vermisse Omegle aber das ist cool", "Hallo aus Deutschland",
            "Mädchen hier?", "Ich bin aus London", "Langweilig af", "Wer will reden?", "M oder F?",
            "Video?", "Überspringen", "Nächster", "Lol", "Wtf", "Cool", "Hi", "Hallo", "Was geht ab?", "Hey!",
            "Fühle mich einsam heute Abend?", "Jemand Lust auf Chat?", "Diese App macht Spaß",
            "Haha das ist lustig", "Was machst du gerade?", "Schön euch kennenzulernen",
            "Tschüss", "Muss bald gehen", "Jemand spielt Spiele?", "Lieblingsfilm?", "Wetter ist scheiße hier",
            "Nur chillen", "Sup Kumpel?", "Vermisse die alten Chat-Seiten", "Das ist super!",
            "Jemand aus Asien?", "Guten Morgen alle", "Gute Nacht Leute", "Lasst uns über das Leben reden",
            "Ich bin neu hier", "Hilf mir die Zeit zu töten", "Langweiliger Tag bei der Arbeit",
            "Schule ist überbewertet lol", "Wochenendpläne?", "Reisegeschichten?", "Essensempfehlungen?",
            "Musikgeschmäcker?", "Bücher jemand?", "Sportfans hier?", "Total langweilig", "Lass uns quatschen",
            "Was für ein fauler Tag", "Jemand zum Auskotzen?", "Lache laut hier lol", "Danke für den Chat"
        ],
        fr: [
            "Bonjour tout le monde!", "Quelqu'un des USA ici?", "Tellement ennuyé maintenant...",
            "D'où venez-vous?", "Salut du Brésil!", "Ce site est mieux qu'Omegle", "Quelqu'un pour video chat?",
            "C'est réel?", "Cherche des amis", "Quelle heure est-il chez toi?", "Je devrais étudier lol",
            "Design cool ici", "Quelqu'un d'Europe?", "Omegle me manque mais c'est cool", "Salut d'Allemagne",
            "Des filles ici?", "Je suis de Londres", "Ennuyé af", "Qui veut parler?", "H ou F?",
            "Vidéo?", "Skip", "Suivant", "Lol", "Wtf", "Cool", "Salut", "Bonjour", "Quoi de neuf?", "Hey!",
            "Je me sens seul ce soir?", "Quelqu'un pour discuter?", "Cette app est fun", "Haha c'est drôle",
            "Qu'est-ce que tu fais maintenant?", "Ravi de vous rencontrer", "Peace out", "Je dois y aller bientôt",
            "Quelqu'un joue à des jeux?", "Film préféré?", "Météo nulle ici", "Juste en train de chiller",
            "Sup mec?", "Les anciens sites de chat me manquent", "C'est génial!", "Quelqu'un d'Asie?",
            "Bonjour tout le monde", "Bonne nuit les gens", "Parlons de la vie", "Je suis nouveau ici",
            "Aide-moi à tuer le temps", "Journée ennuyeuse au travail", "L'école est surcotée lol",
            "Plans pour le weekend?", "Histoires de voyage?", "Recommandations nourriture?", "Goûts musicaux?",
            "Livres quelqu'un?", "Fans de sport ici?", "Totalement ennuyé", "Allons discuter",
            "Quelle journée paresseuse", "Quelqu'un pour se confier?", "Je ris fort ici lol", "Merci pour la discussion"
        ],
        it: [
            "Ciao a tutti!", "Qualcuno dagli USA qui?", "Così annoiato ora...", "Da dove venite?",
            "Ciao dal Brasile!", "Questo sito è meglio di Omegle", "Qualcuno per video chat?",
            "È reale?", "Cerco amici", "Che ora è da te?", "Dovrei studiare lol",
            "Design figo qui", "Qualcuno dall'Europa?", "Mi manca Omegle ma questo è cool", "Ciao dalla Germania",
            "Ragazze qui?", "Sono di Londra", "Annoiato af", "Chi vuole parlare?", "M o F?",
            "Video?", "Salta", "Prossimo", "Lol", "Wtf", "Cool", "Ciao", "Salve", "Che c'è?", "Ehi!",
            "Mi sento solo stasera?", "Qualcuno per chattare?", "Questa app è divertente", "Haha è divertente",
            "Cosa stai facendo ora?", "Piacere di conoscervi", "Peace out", "Devo andare presto",
            "Qualcuno gioca?", "Film preferito?", "Tempo schifoso qui", "Solo chilling", "Sup dude?",
            "Mi mancano i vecchi siti di chat", "È fantastico!", "Qualcuno dall'Asia?", "Buongiorno a tutti",
            "Buonanotte gente", "Parliamo della vita", "Sono nuovo qui", "Aiutami a passare il tempo",
            "Giornata noiosa al lavoro", "La scuola è sopravvalutata lol", "Piani per il weekend?",
            "Storie di viaggio?", "Raccomandazioni cibo?", "Gusti musicali?", "Libri qualcuno?",
            "Fan dello sport qui?", "Totalmente annoiato", "Andiamo a chiacchierare",
            "Che giornata pigra", "Qualcuno per sfogarsi?", "Rido forte qui lol", "Grazie per la chiacchierata"
        ],
        es: [
            "¡Hola a todos!", "Alguien de USA aquí?", "Tan aburrido ahora...", "¿De dónde son?",
            "Hola desde Brasil!", "Este sitio es mejor que Omegle", "¿Alguien para video chat?",
            "¿Es real?", "Buscando amigos", "¿Qué hora es para ti?", "Debería estar estudiando lol",
            "Diseño genial aquí", "¿Alguien de Europa?", "Extraño Omegle pero esto es cool", "Hola desde Alemania",
            "¿Chicas aquí?", "Soy de Londres", "Aburrido af", "¿Quién quiere hablar?", "¿H o M?",
            "¿Video?", "Saltar", "Siguiente", "Lol", "Wtf", "Genial", "Hola", "¡Hola!", "¿Qué pasa?", "¡Ey!",
            "¿Me siento solo esta noche?", "¿Alguien para charlar?", "Esta app es divertida", "Haha eso es gracioso",
            "¿Qué estás haciendo ahora?", "Encantado de conocerlos", "Peace out", "Tengo que ir pronto",
            "¿Alguien juega juegos?", "¿Película favorita?", "El clima apesta aquí", "Solo chilling",
            "¿Sup amigo?", "Extraño los viejos sitios de chat", "¡Esto es increíble!", "¿Alguien de Asia?",
            "Buenos días a todos", "Buenas noches gente", "Hablemos de la vida", "Soy nuevo aquí",
            "Ayúdame a matar el tiempo", "Día aburrido en el trabajo", "La escuela está sobrevalorada lol",
            "¿Planes para el fin de semana?", "¿Historias de viaje?", "¿Recomendaciones de comida?", "¿Gustos musicales?",
            "¿Libros alguien?", "¿Fans de deportes aquí?", "Totalmente aburrido", "¿Vamos a charlar?",
            "¿Qué día perezoso?", "¿Alguien para desahogarse?", "Me río fuerte aquí lol", "Gracias por la charla"
        ],
        ko: [
            "안녕하세요 모두!", "미국에서 누가 있어요?", "지금 너무 지루해...", "어디서 오셨어요?",
            "브라질에서 안녕!", "이 사이트는 Omegle보다 좋아", "비디오 채팅 할 사람?",
            "이게 진짜야?", "친구 찾고 있어", "지금 몇 시야?", "공부해야 하는데 lol",
            "여기 디자인 멋져", "유럽에서 누가 있어?", "Omegle 그리워 하지만 이게 cool", "독일에서 안녕",
            "여자들 있어?", "런던에서 왔어", "지루해 af", "누가 이야기하고 싶어?", "M or F?",
            "비디오?", "스킵", "다음", "Lol", "Wtf", "Cool", "안녕", "여보세요", "뭐 해?", "헤이!",
            "오늘 밤 외로워?", "채팅 할 사람?", "이 앱 재미있어", "하하 재미있네",
            "지금 뭐 해?", "만나서 반가워", "Peace out", "곧 가야 해",
            "게임 하는 사람?", "좋아하는 영화?", "여기 날씨 최악", "그냥 chilling", "Sup 친구?",
            "옛 채팅 사이트 그리워", "이거 최고!", "아시아에서 누가?", "모두 좋은 아침",
            "좋은 밤 되세요", "인생 이야기 해보자", "여기 처음이야", "시간 때우기 도와줘",
            "직장에서 지루한 날", "학교는 과대평가 lol", "주말 계획?", "여행 이야기?",
            "음식 추천?", "음악 취향?", "책 누가?", "스포츠 팬 여기?"
        ],
        ja: [
            "こんにちは皆さん!", "アメリカから誰かいますか?", "今すごく退屈...", "どこから来ましたか?",
            "ブラジルからこんにちは!", "このサイトはOmegleよりいい", "ビデオチャットしたい人?",
            "これ本物?", "友達探してる", "今何時?", "勉強しなきゃ lol",
            "ここデザインかっこいい", "ヨーロッパから誰か?", "Omegle恋しいけどこれcool", "ドイツからこんにちは",
            "女の子いる?", "ロンドンから", "退屈af", "誰か話したい?", "M or F?",
            "ビデオ?", "スキップ", "次", "Lol", "Wtf", "Cool", "こんにちは", "ハロー", "どう?", "ヘイ!",
            "今夜寂しい?", "チャットしたい人?", "このアプリ楽しい", "ハハ面白い",
            "今何してる?", "よろしく", "Peace out", "そろそろ行かなきゃ",
            "ゲームする人?", "好きな映画?", "ここ天気悪い", "ただchilling", "Sup dude?",
            "古いチャットサイト恋しい", "これすごい!", "アジアから誰か?", "皆さんおはよう",
            "おやすみ皆さん", "人生話そう", "ここ初めて", "時間潰し手伝って",
            "仕事で退屈な日", "学校過大評価 lol", "週末予定?", "旅行話?",
            "食べ物おすすめ?", "音楽の好み?", "本誰か?", "スポーツファンここ?"
        ],
        ru: [
            "Привет всем!", "Кто-то из США здесь?", "Так скучно сейчас...", "Откуда вы?",
            "Привет из Бразилии!", "Этот сайт лучше Omegle", "Кто-то для видео чата?",
            "Это реально?", "Ищу друзей", "Сколько времени у тебя?", "Я должен учиться lol",
            "Крутой дизайн здесь", "Кто-то из Европы?", "Скучаю по Omegle но это cool", "Привет из Германии",
            "Девушки здесь?", "Я из Лондона", "Скучно af", "Кто хочет поговорить?", "М или Ж?",
            "Видео?", "Пропустить", "Следующий", "Lol", "Wtf", "Круто", "Привет", "Здравствуйте", "Что нового?", "Эй!",
            "Чувствую себя одиноким сегодня вечером?", "Кто-то для чата?", "Это приложение весело", "Хаха смешно",
            "Что ты делаешь сейчас?", "Рад познакомиться", "Peace out", "Скоро уйду",
            "Кто-то играет в игры?", "Любимый фильм?", "Погода здесь отстой", "Просто chilling",
            "Sup чувак?", "Скучаю по старым чат-сайтам", "Это потрясающе!", "Кто-то из Азии?",
            "Доброе утро всем", "Спокойной ночи ребята", "Поговорим о жизни", "Я новичок здесь",
            "Помоги убить время", "Скучный день на работе", "Школа переоценена lol",
            "Планы на выходные?", "Истории путешествий?", "Рекомендации еды?", "Музыкальные вкусы?",
            "Книги кто-то?", "Фанаты спорта здесь?", "Полностью скучно", "Давай поболтаем",
            "Какой ленивый день", "Кто-то для излияния души?", "Смеюсь громко здесь lol", "Спасибо за разговор"
        ]
    },
    trending: {
        en: [
            "Did you see the news?", "Viral video on TikTok is crazy", "Twitter is on fire today",
            "What is trending now?", "Anyone watching the game?", "Omg I can't believe that happened",
            "Meme of the day lol", "Trends change so fast", "Elon Musk is crazy", "Taylor Swift new album?",
            "World cup coming", "GTA VI trailer?", "AI is scary", "Bitcoin or solana?", "Netflix series recommendation?",
            "That celebrity scandal is wild", "New iPhone release?", "Climate change news", "Election updates?",
            "Viral dance challenge", "Funny cat videos", "Stock market crash?", "New movie hype",
            "Social media drama", "Influencer beef", "Tech gadgets trending", "Fashion week highlights",
            "Sports highlights", "Music charts top", "Gaming updates", "Food trends", "Travel hacks viral",
            "Fitness challenges", "Beauty tips", "DIY projects", "Horror stories trending", "Comedy skits"
        ],
        pt: [
            "Você viu as notícias?", "Vídeo viral no TikTok é louco", "Twitter tá pegando fogo hoje",
            "O que tá trending agora?", "Alguém assistindo o jogo?", "Meu deus não acredito que aconteceu",
            "Meme do dia kkk", "Trends mudam tão rápido", "Elon Musk é louco", "Novo álbum da Taylor Swift?",
            "Copa do mundo chegando", "Trailer do GTA VI?", "IA é assustadora", "Bitcoin ou solana?", "Recomendação de série Netflix?",
            "Escândalo de celebridade é insano", "Novo iPhone lançado?", "Notícias de mudança climática",
            "Atualizações de eleição?", "Desafio de dança viral", "Vídeos engraçados de gatos",
            "Queda na bolsa?", "Hype de novo filme", "Drama nas redes sociais", "Briga de influenciadores",
            "Gadgets tech trending", "Destaques da semana de moda", "Destaques esportivos", "Top das paradas musicais",
            "Atualizações de games", "Trends de comida", "Hacks de viagem viral", "Desafios fitness",
            "Dicas de beleza", "Projetos DIY", "Histórias de terror trending", "Esquetes de comédia"
        ],
        de: [
            "Hast du die Nachrichten gesehen?", "Virales Video auf TikTok ist verrückt", "Twitter brennt heute",
            "Was trendet jetzt?", "Schaut jemand das Spiel?", "Omg ich kann nicht glauben dass das passiert ist",
            "Meme des Tages lol", "Trends ändern sich so schnell", "Elon Musk ist verrückt", "Neues Album von Taylor Swift?",
            "WM kommt", "GTA VI Trailer?", "KI ist scary", "Bitcoin oder Solana?", "Netflix Serie Empfehlung?",
            "Der Celebrity-Skandal ist wild", "Neues iPhone Release?", "Klimawandel News", "Wahlupdates?",
            "Virales Tanzchallenge", "Lustige Katzenvideos", "Börsenkrach?", "Neuer Film Hype",
            "Soziale Medien Drama", "Influencer Beef", "Tech Gadgets trending", "Fashion Week Highlights",
            "Sport Highlights", "Musik Charts Top", "Gaming Updates", "Food Trends", "Travel Hacks viral",
            "Fitness Challenges", "Beauty Tips", "DIY Projekte", "Horror Stories trending", "Comedy Skits"
        ],
        fr: [
            "As-tu vu les nouvelles?", "Vidéo virale sur TikTok est folle", "Twitter est en feu aujourd'hui",
            "Qu'est-ce qui est trending maintenant?", "Quelqu'un regarde le match?", "Omg je n'arrive pas à y croire",
            "Meme du jour lol", "Les trends changent si vite", "Elon Musk est fou", "Nouvel album de Taylor Swift?",
            "Coupe du monde arrive", "Trailer GTA VI?", "L'IA est effrayante", "Bitcoin ou solana?", "Recommandation série Netflix?",
            "Le scandale de célébrité est dingue", "Nouveau iPhone sorti?", "Nouvelles sur le changement climatique",
            "Mises à jour élections?", "Challenge danse viral", "Vidéos drôles de chats", "Krach boursier?",
            "Hype nouveau film", "Drama réseaux sociaux", "Beef influenceurs", "Gadgets tech trending",
            "Highlights fashion week", "Highlights sports", "Top charts musique", "Updates gaming",
            "Trends food", "Hacks voyage viral", "Challenges fitness", "Tips beauté", "Projets DIY",
            "Histoires horreur trending", "Skits comédie"
        ],
        it: [
            "Hai visto le notizie?", "Video virale su TikTok è pazzo", "Twitter è in fiamme oggi",
            "Cosa è trending ora?", "Qualcuno guarda la partita?", "Omg non ci credo che è successo",
            "Meme del giorno lol", "I trends cambiano così veloce", "Elon Musk è pazzo", "Nuovo album di Taylor Swift?",
            "Mondiali arrivano", "Trailer GTA VI?", "AI è spaventosa", "Bitcoin o solana?", "Raccomandazione serie Netflix?",
            "Lo scandalo celebrity è wild", "Nuovo iPhone release?", "Notizie cambiamento climatico",
            "Aggiornamenti elezioni?", "Challenge danza virale", "Video divertenti gatti", "Crollo borsa?",
            "Hype nuovo film", "Drama social media", "Beef influencer", "Gadgets tech trending",
            "Highlights fashion week", "Highlights sport", "Top charts musica", "Updates gaming",
            "Trends food", "Hacks viaggio virali", "Challenges fitness", "Tips bellezza", "Progetti DIY",
            "Storie horror trending", "Skits commedia"
        ],
        es: [
            "¿Viste las noticias?", "Video viral en TikTok es loco", "Twitter está en llamas hoy",
            "¿Qué está trending ahora?", "¿Alguien viendo el partido?", "Omg no puedo creer que pasó",
            "Meme del día lol", "Los trends cambian tan rápido", "Elon Musk está loco", "¿Nuevo álbum de Taylor Swift?",
            "Mundial viene", "¿Trailer GTA VI?", "IA es aterradora", "¿Bitcoin o solana?", "¿Recomendación serie Netflix?",
            "El escándalo de celebridad es salvaje", "¿Nuevo iPhone lanzado?", "Noticias cambio climático",
            "¿Actualizaciones elecciones?", "Challenge baile viral", "Videos graciosos gatos", "¿Caída bolsa?",
            "Hype nueva película", "Drama redes sociales", "Beef influencers", "Gadgets tech trending",
            "Highlights semana moda", "Highlights deportes", "Top charts música", "Updates gaming",
            "Trends comida", "Hacks viaje viral", "Challenges fitness", "Tips belleza", "Proyectos DIY",
            "Historias horror trending", "Skits comedia"
        ],
        ko: [
            "뉴스 봤어?", "TikTok 바이럴 비디오 미쳤어", "오늘 트위터 불타네",
            "지금 뭐 트렌딩?", "경기 보는 사람?", "Omg 그게 일어났다니 믿기지 않아",
            "오늘의 meme lol", "트렌드 너무 빨리 변해", "Elon Musk 미쳤어", "Taylor Swift 새 앨범?",
            "월드컵 오나", "GTA VI 트레일러?", "AI 무서워", "Bitcoin or solana?", "Netflix 시리즈 추천?",
            "그 유명인 스캔들 미쳤어", "새 iPhone 출시?", "기후 변화 뉴스", "선거 업데이트?",
            "바이럴 댄스 챌린지", "웃긴 고양이 비디오", "주식 시장 크래시?", "새 영화 하이프",
            "소셜 미디어 드라마", "인플루언서 비프", "테크 가젯 트렌딩", "패션 위크 하이라이트",
            "스포츠 하이라이트", "음악 차트 탑", "게이밍 업데이트", "푸드 트렌드", "여행 핵 바이럴",
            "피트니스 챌린지", "뷰티 팁", "DIY 프로젝트", "호러 스토리 트렌딩", "코미디 스킷"
        ],
        ja: [
            "ニュース見た?", "TikTokのバイラルビデオ疯狂", "今日Twitter燃えてる",
            "今何トレンド?", "試合見てる人?", "Omg 信じられない",
            "今日のmeme lol", "トレンド早く変わる", "Elon Musk 狂ってる", "Taylor Swift新アルバム?",
            "ワールドカップ来る", "GTA VIトレーラー?", "AI怖い", "Bitcoin or solana?", "Netflixシリーズおすすめ?",
            "その有名人スキャンダルwild", "新iPhoneリリース?", "気候変動ニュース", "選挙アップデート?",
            "バイラルダンスチャレンジ", "面白い猫ビデオ", "株式市場クラッシュ?", "新映画ハイプ",
            "ソーシャルメディアドラマ", "インフルエンサービーフ", "テックガジェットトレンド",
            "ファッションウィークハイライト", "スポーツハイライト", "音楽チャートトップ", "ゲーミングアップデート",
            "フードトレンド", "トラベルハックバイラル", "フィットネスチャレンジ", "ビューティーティップス",
            "DIYプロジェクト", "ホラーストーリートレンド", "コメディスキット"
        ],
        ru: [
            "Видел новости?", "Вирусное видео на TikTok сумасшедшее", "Twitter в огне сегодня",
            "Что трендит сейчас?", "Кто-то смотрит игру?", "Omg не верю что это случилось",
            "Мем дня lol", "Тренды меняются так быстро", "Elon Musk сумасшедший", "Новый альбом Taylor Swift?",
            "ЧМ приближается", "Трейлер GTA VI?", "ИИ страшно", "Bitcoin или solana?", "Рекомендация сериала Netflix?",
            "Скандал знаменитости wild", "Новый iPhone релиз?", "Новости изменения климата",
            "Обновления выборов?", "Вирусный танцевальный челлендж", "Смешные видео котов", "Крах фондового рынка?",
            "Хайп нового фильма", "Драма соцсетей", "Биф инфлюенсеров", "Тех гаджеты тренд",
            "Хайлайты недели моды", "Хайлайты спорта", "Топ чартов музыки", "Обновления гейминга",
            "Тренды еды", "Хаки путешествий вирусные", "Челленджи фитнес", "Типсы красоты", "Проекты DIY",
            "Истории ужасов тренд", "Скиты комедии"
        ]
    },
    invest: { // Corrigido de "money" para "invest" na distribuição
        en: [
            "BTC going to the moon 🚀", "Anyone into Nvidia stocks?", "Buy the dip!",
            "Crypto is crashing again?", "Hold or sell?", "Forex trading anyone?",
            "ETH is solid", "Bear market is over", "Investment tips?", "Solana is pumping",
            "NFTs are dead?", "Day trade is hard", "HODL", "Stock market open?",
            "S&P500 analysis", "Gold prices rising", "Real estate bubble?", "Dividend stocks",
            "Options trading risky", "Warren Buffett advice", "Crypto regulations news",
            "Tesla stock dip", "Apple earnings report", "Inflation rates", "Bonds vs stocks",
            "Retirement planning", "Index funds best?", "DeFi projects", "Altcoins to watch",
            "Market crash coming?", "Bull run starting", "Portfolio diversification",
            "Tech sector growth", "Energy stocks", "Biotech investments", "Emerging markets"
        ],
        pt: [
            "BTC indo pra lua 🚀", "Alguém em ações da Nvidia?", "Compra na baixa!",
            "Crypto tá caindo de novo?", "Hold ou sell?", "Alguém no Forex?",
            "ETH é sólido", "Mercado bear acabou", "Dicas de investimento?", "Solana tá pumpando",
            "NFTs morreram?", "Day trade é difícil", "HODL", "Bolsa aberta?",
            "Análise S&P500", "Preços do ouro subindo", "Bolha imobiliária?", "Ações com dividendos",
            "Trading de opções arriscado", "Conselhos do Warren Buffett", "Notícias de regulação crypto",
            "Queda na ação da Tesla", "Relatório de lucros da Apple", "Taxas de inflação", "Bonds vs ações",
            "Planejamento de aposentadoria", "Fundos indexados melhores?", "Projetos DeFi", "Altcoins pra observar",
            "Crash no mercado vindo?", "Bull run começando", "Diversificação de portfólio",
            "Crescimento setor tech", "Ações de energia", "Investimentos biotech", "Mercados emergentes"
        ],
        de: [
            "BTC zum Mond 🚀", "Jemand in Nvidia Aktien?", "Buy the dip!",
            "Crypto crasht wieder?", "Hold or sell?", "Forex Trading jemand?",
            "ETH ist solid", "Bear Market vorbei", "Investment Tipps?", "Solana pumpt",
            "NFTs tot?", "Day Trade hart", "HODL", "Aktienmarkt offen?",
            "S&P500 Analyse", "Goldpreise steigen", "Immobilienblase?", "Dividendenaktien",
            "Options Trading riskant", "Warren Buffett Rat", "Crypto Regulierungen News",
            "Tesla Aktie Dip", "Apple Earnings Report", "Inflationsraten", "Bonds vs Aktien",
            "Rentenplanung", "Indexfonds am besten?", "DeFi Projekte", "Altcoins zu beobachten",
            "Marktcrash kommt?", "Bull Run startet", "Portfolio Diversifikation",
            "Tech Sektor Wachstum", "Energie Aktien", "Biotech Investments", "Emerging Markets"
        ],
        fr: [
            "BTC va sur la lune 🚀", "Quelqu'un dans actions Nvidia?", "Buy the dip!",
            "Crypto crash encore?", "Hold or sell?", "Trading Forex quelqu'un?",
            "ETH est solide", "Bear market fini", "Tips investissement?", "Solana pompe",
            "NFTs morts?", "Day trade dur", "HODL", "Marché boursier ouvert?",
            "Analyse S&P500", "Prix or montent", "Bulbe immobilier?", "Actions dividendes",
            "Trading options risqué", "Conseils Warren Buffett", "News régulations crypto",
            "Dip action Tesla", "Rapport earnings Apple", "Taux inflation", "Bonds vs actions",
            "Planification retraite", "Fonds index meilleurs?", "Projets DeFi", "Altcoins à surveiller",
            "Crash marché arrive?", "Bull run commence", "Diversification portefeuille",
            "Croissance secteur tech", "Actions énergie", "Investissements biotech", "Marchés émergents"
        ],
        it: [
            "BTC va sulla luna 🚀", "Qualcuno in azioni Nvidia?", "Buy the dip!",
            "Crypto crash di nuovo?", "Hold or sell?", "Trading Forex qualcuno?",
            "ETH è solido", "Bear market finito", "Tips investimento?", "Solana pompa",
            "NFT morti?", "Day trade duro", "HODL", "Mercato azionario aperto?",
            "Analisi S&P500", "Prezzi oro salgono", "Bolla immobiliare?", "Azioni dividendi",
            "Trading opzioni rischioso", "Consigli Warren Buffett", "News regolazioni crypto",
            "Dip azione Tesla", "Report earnings Apple", "Tassi inflazione", "Bonds vs azioni",
            "Pianificazione pensione", "Fondi index migliori?", "Progetti DeFi", "Altcoins da osservare",
            "Crash mercato arriva?", "Bull run inizia", "Diversificazione portfolio",
            "Crescita settore tech", "Azioni energia", "Investimenti biotech", "Mercati emergenti"
        ],
        es: [
            "BTC va a la luna 🚀", "¿Alguien en acciones Nvidia?", "¡Buy the dip!",
            "¿Crypto crash de nuevo?", "¿Hold or sell?", "¿Trading Forex alguien?",
            "ETH es sólido", "Bear market terminado", "¿Tips inversión?", "Solana pumpeando",
            "¿NFTs muertos?", "Day trade duro", "HODL", "¿Mercado de valores abierto?",
            "Análisis S&P500", "Precios oro subiendo", "¿Burbuja inmobiliaria?", "Acciones dividendos",
            "Trading opciones riesgoso", "Consejos Warren Buffett", "Noticias regulaciones crypto",
            "Dip acción Tesla", "Reporte earnings Apple", "Tasas inflación", "Bonds vs acciones",
            "Planificación jubilación", "¿Fondos índice mejores?", "Proyectos DeFi", "Altcoins a observar",
            "¿Crash mercado viene?", "Bull run empezando", "Diversificación portafolio",
            "Crecimiento sector tech", "Acciones energía", "Inversiones biotech", "Mercados emergentes"
        ],
        ko: [
            "BTC 달로 🚀", "Nvidia 주식 하는 사람?", "Buy the dip!",
            "크립토 다시 크래시?", "Hold or sell?", "Forex 트레이딩 누가?",
            "ETH 솔리드", "베어 마켓 끝", "투자 팁?", "Solana 펌핑",
            "NFT 죽었어?", "데이 트레이드 어렵", "HODL", "주식 시장 열림?",
            "S&P500 분석", "금 가격 상승", "부동산 버블?", "배당 주식",
            "옵션 트레이딩 위험", "Warren Buffett 조언", "크립토 규제 뉴스",
            "Tesla 주식 딥", "Apple 수익 보고서", "인플레이션 비율", "채권 vs 주식",
            "퇴직 계획", "인덱스 펀드 최고?", "DeFi 프로젝트", "알트코인 주목",
            "시장 크래시 올까?", "불 런 시작", "포트폴리오 다각화",
            "테크 섹터 성장", "에너지 주식", "바이오테크 투자", "신흥 시장"
        ],
        ja: [
            "BTC 月へ 🚀", "Nvidia株誰か?", "Buy the dip!",
            "クリプトまたクラッシュ?", "Hold or sell?", "Forexトレーディング誰か?",
            "ETHソリッド", "ベアマーケット終わり", "投資Tips?", "Solanaポンピング",
            "NFT死んだ?", "デイトレードハード", "HODL", "株式市場オープン?",
            "S&P500分析", "金価格上昇", "不動産バブル?", "配当株",
            "オプショントレーディングリスク", "Warren Buffettアドバイス", "クリプト規制ニュース",
            "Tesla株ディップ", "Apple収益レポート", "インフレ率", "ボンド vs 株",
            "退職計画", "インデックスファンドベスト?", "DeFiプロジェクト", "アルトコインウォッチ",
            "マーケットクラッシュ来る?", "ブルランスタート", "ポートフォリオ多様化",
            "テックセクター成長", "エネルギー株", "バイオテック投資", "新興市場"
        ],
        ru: [
            "BTC на луну 🚀", "Кто-то в акциях Nvidia?", "Buy the dip!",
            "Крипта опять крашится?", "Hold or sell?", "Форекс трейдинг кто-то?",
            "ETH солидный", "Bear market кончился", "Советы инвестиций?", "Solana пампит",
            "NFT мертвы?", "Дей трейд сложно", "HODL", "Фондовый рынок открыт?",
            "Анализ S&P500", "Цены на золото растут", "Пузырь недвижимости?", "Дивидендные акции",
            "Трейдинг опционами рискованно", "Советы Warren Buffett", "Новости регуляций крипто",
            "Дип акции Tesla", "Отчет о прибылях Apple", "Ставки инфляции", "Бонды vs акции",
            "Планирование пенсии", "Индексные фонды лучшие?", "Проекты DeFi", "Алткоины смотреть",
            "Краш рынка приходит?", "Булл ран начинается", "Диверсификация портфеля",
            "Рост сектора tech", "Акции энергии", "Инвестиции biotech", "Развивающиеся рынки"
        ]
    },
    nofilter: {
        en: [
            "Unpopular opinion: Pizza with pineapple is good", "Lets debate", "Trump or Biden?",
            "Politics are boring", "Tell me a secret", "Freedom of speech here", "I hate mondays",
            "Truth or dare?", "Earth is flat (joke)", "Aliens exist", "Simulation theory",
            "Change my mind", "Roast me", "F*ck it", "Religion debates", "Conspiracy theories",
            "Worst date stories", "Embarrassing moments", "Hot takes on celebrities",
            "Social media is toxic", "Cancel culture sucks", "Gender debates", "Money vs happiness",
            "Work life balance myth", "Diet fads", "Fitness myths", "Relationship red flags",
            "Parenting fails", "School system broken", "Capitalism vs socialism", "Gun control"
        ],
        pt: [
            "Opinião impopular: Pizza com abacaxi é boa", "Vamos debater", "Trump ou Biden?",
            "Política é chata", "Me conte um segredo", "Liberdade de expressão aqui", "Odeio segundas",
            "Verdade ou desafio?", "Terra é plana (brincadeira)", "Aliens existem", "Teoria da simulação",
            "Mude minha mente", "Me roast", "F*da-se", "Debates religião", "Teorias da conspiração",
            "Histórias de dates ruins", "Momentos embaraçosos", "Takes quentes sobre celebridades",
            "Redes sociais são tóxicas", "Cultura do cancelamento sucks", "Debates gênero", "Dinheiro vs felicidade",
            "Mito do equilíbrio trabalho vida", "Modas de dieta", "Mitos fitness", "Bandeiras vermelhas relacionamento",
            "Falhas na parentalidade", "Sistema escolar quebrado", "Capitalismo vs socialismo", "Controle de armas"
        ],
        de: [
            "Unpopuläre Meinung: Pizza mit Ananas ist gut", "Lasst uns debattieren", "Trump oder Biden?",
            "Politik ist langweilig", "Erzähl mir ein Geheimnis", "Redefreiheit hier", "Ich hasse Montage",
            "Wahrheit oder Pflicht?", "Erde ist flach (Witz)", "Aliens existieren", "Simulationstheorie",
            "Ändere meine Meinung", "Roast mich", "F*ck it", "Religionsdebatten", "Verschwörungstheorien",
            "Schlechteste Date Geschichten", "Peinliche Momente", "Hot Takes auf Celebrities",
            "Soziale Medien toxisch", "Cancel Culture sucks", "Gender Debatten", "Geld vs Glück",
            "Work Life Balance Mythos", "Diät Fads", "Fitness Mythen", "Beziehungs Red Flags",
            "Eltern Fails", "Schulsystem kaputt", "Kapitalismus vs Sozialismus", "Waffenkontrolle"
        ],
        fr: [
            "Opinion impopulaire: Pizza avec ananas est bonne", "Débattons", "Trump ou Biden?",
            "Politique est ennuyeuse", "Raconte-moi un secret", "Liberté d'expression ici", "Je déteste les lundis",
            "Action ou vérité?", "Terre est plate (blague)", "Aliens existent", "Théorie simulation",
            "Change mon avis", "Roast moi", "F*ck it", "Débats religion", "Théories conspiration",
            "Histoires pires dates", "Moments embarrassants", "Hot takes sur célébrités",
            "Réseaux sociaux toxiques", "Cancel culture sucks", "Débats genre", "Argent vs bonheur",
            "Mythe équilibre travail vie", "Modes diètes", "Mythes fitness", "Red flags relations",
            "Échecs parentalité", "Système scolaire cassé", "Capitalisme vs socialisme", "Contrôle armes"
        ],
        it: [
            "Opinione impopolare: Pizza con ananas è buona", "Dibattiamo", "Trump o Biden?",
            "Politica è noiosa", "Dimmi un segreto", "Libertà di parola qui", "Odio i lunedì",
            "Verità o obbligo?", "Terra è piatta (scherzo)", "Alieni esistono", "Teoria simulazione",
            "Cambia idea", "Roast me", "F*ck it", "Dibattiti religione", "Teorie cospirazione",
            "Storie peggiori date", "Momenti imbarazzanti", "Hot takes su celebrità",
            "Social media tossici", "Cancel culture sucks", "Dibattiti genere", "Soldi vs felicità",
            "Mito equilibrio lavoro vita", "Mode diete", "Miti fitness", "Red flags relazioni",
            "Fallimenti genitorialità", "Sistema scolastico rotto", "Capitalismo vs socialismo", "Controllo armi"
        ],
        es: [
            "Opinión impopular: Pizza con piña es buena", "Debatamos", "¿Trump o Biden?",
            "Política es aburrida", "Cuéntame un secreto", "Libertad de expresión aquí", "Odio los lunes",
            "¿Verdad o reto?", "Tierra es plana (broma)", "Aliens existen", "Teoría simulación",
            "Cambia mi mente", "Roast me", "F*ck it", "Debates religión", "Teorías conspiración",
            "Historias peores citas", "Momentos embarazosos", "Hot takes sobre celebridades",
            "Redes sociales tóxicas", "Cancel culture sucks", "Debates género", "Dinero vs felicidad",
            "Mito equilibrio trabajo vida", "Modas dietas", "Mitos fitness", "Red flags relaciones",
            "Fallos parentalidad", "Sistema escolar roto", "Capitalismo vs socialismo", "Control armas"
        ],
        ko: [
            "인기없는 의견: 파인애플 피자 좋다", "토론하자", "Trump or Biden?",
            "정치 지루해", "비밀 말해줘", "여기 표현의 자유", "월요일 싫어",
            "진실 or 도전?", "지구 평평 (농담)", "외계인 존재", "시뮬레이션 이론",
            "내 마음 바꿔", "Roast me", "F*ck it", "종교 토론", "음모 이론",
            "최악 데이트 이야기", "창피한 순간", "셀럽 핫 테이크",
            "소셜 미디어 독성", "캔슬 컬처 sucks", "젠더 토론", "돈 vs 행복",
            "워크 라이프 밸런스 신화", "다이어트 패드", "피트니스 신화", "관계 레드 플래그",
            "부모 실패", "학교 시스템 고장", "자본주의 vs 사회주의", "총기 통제"
        ],
        ja: [
            "不人気意見: パイナップルピザいい", "議論しよう", "Trump or Biden?",
            "政治つまらない", "秘密教えて", "ここ表現の自由", "月曜日嫌い",
            "真実 or 挑戦?", "地球平ら (ジョーク)", "エイリアン存在", "シミュレーション理論",
            "意見変えて", "Roast me", "F*ck it", "宗教議論", "陰謀論",
            "最悪デートストーリー", "恥ずかしい瞬間", "セレブホットテイク",
            "ソーシャルメディア毒", "キャンセルカルチャー sucks", "ジェンダー議論", "お金 vs 幸せ",
            "ワークライフバランス神話", "ダイエットファッド", "フィットネス神話", "関係レッドフラッグ",
            "親失敗", "学校システム壊れ", "資本主義 vs 社会主義", "銃規制"
        ],
        ru: [
            "Непопулярное мнение: Пицца с ананасом хороша", "Давай дебатировать", "Trump or Biden?",
            "Политика скучная", "Расскажи секрет", "Свобода слова здесь", "Ненавижу понедельники",
            "Правда или действие?", "Земля плоская (шутка)", "Инопланетяне существуют", "Теория симуляции",
            "Измените мое мнение", "Roast me", "F*ck it", "Дебаты религии", "Теории заговора",
            "Худшие истории свиданий", "Смущающие моменты", "Hot takes на знаменитостей",
            "Социальные сети токсичны", "Cancel culture sucks", "Дебаты гендера", "Деньги vs счастье",
            "Миф баланса работы жизни", "Моды диет", "Мифы фитнеса", "Красные флаги отношений",
            "Провалы родителей", "Школьная система сломана", "Капитализм vs социализм", "Контроль оружия"
        ]
    },
    stories: {
        en: [
            "I have a confession...", "My day was terrible", "Let me tell you a story",
            "Once upon a time...", "Need advice on my relationship", "Scary stories anyone?",
            "Life is hard sometimes", "Just broke up :(", "I saw a ghost once", "My boss hates me",
            "School is stressing me out", "I think I'm in love", "Advice needed pls", "Crazy adventure story",
            "Childhood memories", "Travel disaster", "Funny fail", "Heartbreaking moment",
            "Success story", "Lesson learned", "Dream interpretation", "Pet stories", "Family drama",
            "Work horror", "Dating mishaps", "Health scare", "Financial mistake", "Inspirational tale",
            "Mystery unsolved", "Party gone wrong", "Road trip epic"
        ],
        pt: [
            "Tenho uma confissão...", "Meu dia foi terrível", "Deixa eu te contar uma história",
            "Era uma vez...", "Preciso de conselho no relacionamento", "Histórias assustadoras alguém?",
            "Vida é dura às vezes", "Acabei de terminar :(", "Vi um fantasma uma vez", "Meu chefe me odeia",
            "Escola me estressando", "Acho que tô apaixonado", "Preciso de conselho pls", "História de aventura louca",
            "Memórias de infância", "Desastre de viagem", "Falha engraçada", "Momento de partir o coração",
            "História de sucesso", "Lição aprendida", "Interpretação de sonho", "Histórias de pets",
            "Drama familiar", "Horror no trabalho", "Desastres no namoro", "Susto de saúde",
            "Erro financeiro", "Conto inspirador", "Mistério não resolvido", "Festa que deu errado",
            "Viagem de estrada épica"
        ],
        de: [
            "Ich habe ein Geständnis...", "Mein Tag war schrecklich", "Lass mich eine Geschichte erzählen",
            "Es war einmal...", "Brauche Rat in Beziehung", "Gruselige Geschichten jemand?",
            "Leben ist hart manchmal", "Gerade getrennt :(", "Ich sah mal einen Geist", "Mein Chef hasst mich",
            "Schule stresst mich", "Ich glaube ich bin verliebt", "Rat gebraucht pls", "Verrückte Abenteuergeschichte",
            "Kindheitserinnerungen", "Reisedesaster", "Lustiger Fail", "Herzzerbrechender Moment",
            "Erfolgsgeschichte", "Lektion gelernt", "Traumdeutung", "Haustiergeschichten", "Familiendrama",
            "Arbeitshorror", "Dating Missgeschicke", "Gesundheitsschreck", "Finanzfehler", "Inspirierende Geschichte",
            "Ungelöstes Mysterium", "Party schiefgelaufen", "Road Trip Epic"
        ],
        fr: [
            "J'ai une confession...", "Ma journée était terrible", "Laisse-moi te raconter une histoire",
            "Il était une fois...", "Besoin conseil relation", "Histoires effrayantes quelqu'un?",
            "Vie est dure parfois", "Viens de rompre :(", "J'ai vu un fantôme une fois", "Mon boss me déteste",
            "École me stresse", "Je pense être amoureux", "Conseil needed pls", "Histoire aventure folle",
            "Souvenirs enfance", "Désastre voyage", "Fail drôle", "Moment déchirant",
            "Histoire succès", "Leçon apprise", "Interprétation rêve", "Histoires animaux",
            "Drame familial", "Horreur travail", "Mésaventures dating", "Peur santé",
            "Erreur financière", "Conte inspirant", "Mystère non résolu", "Fête ratée",
            "Road trip épique"
        ],
        it: [
            "Ho una confessione...", "La mia giornata era terribile", "Lasciami raccontare una storia",
            "C'era una volta...", "Bisogno consiglio relazione", "Storie spaventose qualcuno?",
            "Vita è dura a volte", "Appena lasciato :(", "Ho visto un fantasma una volta", "Il mio capo mi odia",
            "Scuola mi stressa", "Penso di essere innamorato", "Consiglio needed pls", "Storia avventura pazza",
            "Ricordi infanzia", "Disastro viaggio", "Fail divertente", "Momento straziante",
            "Storia successo", "Lezione imparata", "Interpretazione sogno", "Storie animali",
            "Dramma familiare", "Orrrore lavoro", "Disavventure dating", "Paura salute",
            "Errore finanziario", "Racconto ispiratore", "Mistero irrisolto", "Festa andata male",
            "Road trip epico"
        ],
        es: [
            "Tengo una confesión...", "Mi día fue terrible", "Déjame contarte una historia",
            "Érase una vez...", "Necesito consejo relación", "¿Historias aterradoras alguien?",
            "Vida es dura a veces", "Acabo de romper :(", "Vi un fantasma una vez", "Mi jefe me odia",
            "Escuela me estresa", "Creo que estoy enamorado", "Consejo needed pls", "Historia aventura loca",
            "Recuerdos infancia", "Desastre viaje", "Fail gracioso", "Momento desgarrador",
            "Historia éxito", "Lección aprendida", "Interpretación sueño", "Historias mascotas",
            "Drama familiar", "Horror trabajo", "Desventuras dating", "Susto salud",
            "Error financiero", "Cuento inspirador", "Misterio sin resolver", "Fiesta salió mal",
            "Road trip épico"
        ],
        ko: [
            "고백할 게 있어...", "오늘 최악이었어", "이야기 들려줄게",
            "옛날 옛적에...", "관계 조언 필요", "무서운 이야기 누가?",
            "인생 가끔 힘들어", "방금 헤어졌어 :(", "귀신 봤어 한 번", "상사가 날 싫어해",
            "학교 스트레스", "사랑에 빠진 것 같아", "조언 pls", "미친 모험 이야기",
            "어린 시절 추억", "여행 재난", "웃긴 실패", "마음 아픈 순간",
            "성공 이야기", "배운 교훈", "꿈 해석", "애완동물 이야기", "가족 드라마",
            "일 horror", "데이팅 사고", "건강 공포", "금융 실수", "영감 이야기",
            "미해결 미스터리", "파티 잘못됨", "로드 트립 에픽"
        ],
        ja: [
            "告白がある...", "今日は最悪だった", "物語教えてあげる",
            "昔々...", "関係アドバイス必要", "怖い話誰か?",
            "人生時々ハード", "今別れた :(", "幽霊見たことある", "上司が嫌い",
            "学校ストレス", "恋してると思う", "アドバイス pls", "クレイジーアドベンチャーストーリー",
            "幼少期の思い出", "旅行災害", "面白い失敗", "心痛い瞬間",
            "成功物語", "学んだレッスン", "夢解釈", "ペットストーリー", "家族ドラマ",
            "仕事ホラー", "デートミスハップ", "健康恐怖", "金融ミス", "インスピレーションテール",
            "未解決ミステリー", "パーティー失敗", "ロードトリップエピック"
        ],
        ru: [
            "У меня признание...", "Мой день был ужасным", "Позволь рассказать историю",
            "Жили-были...", "Нужен совет в отношениях", "Страшные истории кто-то?",
            "Жизнь иногда тяжелая", "Только что расстался :(", "Я видел призрака однажды", "Мой босс меня ненавидит",
            "Школа стрессует", "Думаю я влюблен", "Совет needed pls", "Сумасшедшая история приключений",
            "Воспоминания детства", "Катастрофа путешествия", "Смешной фейл", "Разрывающий сердце момент",
            "История успеха", "Урок усвоен", "Толкование сна", "Истории питомцев", "Семейная драма",
            "Ужас на работе", "Провалы свиданий", "Страх здоровья", "Финансовая ошибка", "Вдохновляющая сказка",
            "Неразгаданная тайна", "Вечеринка пошла не так", "Эпический роуд трип"
        ]
    },
    area51: {
        en: [
            "Do you believe in aliens?", "Government secrets...", "UFO sighting yesterday",
            "They are watching us", "Illuminati confirmed", "Area 51 raid was a joke",
            "Matrix is real", "We are living in a simulation", "NASA lies", "Moon landing fake?",
            "Lizard people", "CIA secrets", "Bigfoot exists?", "Loch Ness monster",
            "Time travel possible?", "Parallel universes", "Ghost hunting stories",
            "Cryptozoology", "Ancient aliens", "Crop circles", "Bermuda triangle",
            "MKUltra experiments", "Roswell incident", "Men in black", "Psychic powers",
            "Reincarnation", "Atlantis lost city", "Hollow earth theory", "Chemtrails",
            "Flat earth debate"
        ],
        pt: [
            "Você acredita em aliens?", "Segredos do governo...", "Avistamento de OVNI ontem",
            "Eles estão nos vigiando", "Illuminati confirmado", "Invasão da Area 51 foi piada",
            "Matrix é real", "Vivemos em uma simulação", "NASA mente", "Pouso na lua falso?",
            "Pessoas lagarto", "Segredos da CIA", "Pé Grande existe?", "Monstro do Lago Ness",
            "Viagem no tempo possível?", "Universos paralelos", "Histórias de caça fantasmas",
            "Criptozoologia", "Aliens antigos", "Círculos em plantações", "Triângulo das Bermudas",
            "Experimentos MKUltra", "Incidente Roswell", "Homens de preto", "Poderes psíquicos",
            "Reencarnação", "Cidade perdida de Atlântida", "Teoria terra oca", "Chemtrails",
            "Debate terra plana"
        ],
        de: [
            "Glaubst du an Aliens?", "Regierungsgeheimnisse...", "UFO Sichtung gestern",
            "Sie beobachten uns", "Illuminati bestätigt", "Area 51 Raid war ein Witz",
            "Matrix ist real", "Wir leben in einer Simulation", "NASA lügt", "Mondlandung fake?",
            "Echsenmenschen", "CIA Geheimnisse", "Bigfoot existiert?", "Loch Ness Monster",
            "Zeitreise möglich?", "Parallele Universen", "Geisterjagd Geschichten",
            "Kryptozoologie", "Ancient Aliens", "Kornkreise", "Bermuda Dreieck",
            "MKUltra Experimente", "Roswell Vorfall", "Men in Black", "Psychische Kräfte",
            "Reinkarnation", "Verlorene Stadt Atlantis", "Hohle Erde Theorie", "Chemtrails",
            "Flache Erde Debatte"
        ],
        fr: [
            "Crois-tu aux aliens?", "Secrets gouvernement...", "Observation OVNI hier",
            "Ils nous regardent", "Illuminati confirmé", "Raid Area 51 était une blague",
            "Matrix est réel", "On vit dans une simulation", "NASA ment", "Atterrissage lune fake?",
            "Hommes lézards", "Secrets CIA", "Bigfoot existe?", "Monstre Loch Ness",
            "Voyage temps possible?", "Univers parallèles", "Histoires chasse fantômes",
            "Cryptozoologie", "Aliens anciens", "Crop circles", "Triangle Bermudes",
            "Expériences MKUltra", "Incident Roswell", "Hommes en noir", "Pouvoirs psychiques",
            "Réincarnation", "Cité perdue Atlantis", "Théorie terre creuse", "Chemtrails",
            "Débat terre plate"
        ],
        it: [
            "Credi negli alieni?", "Segreti governo...", "Avvistamento UFO ieri",
            "Ci stanno guardando", "Illuminati confermato", "Raid Area 51 era uno scherzo",
            "Matrix è reale", "Viviamo in una simulazione", "NASA mente", "Allunaggio fake?",
            "Uomini lucertola", "Segreti CIA", "Bigfoot esiste?", "Mostro Loch Ness",
            "Viaggio tempo possibile?", "Universi paralleli", "Storie caccia fantasmi",
            "Criptozoologia", "Alieni antichi", "Cerchi nel grano", "Triangolo Bermude",
            "Esperimenti MKUltra", "Incidente Roswell", "Uomini in nero", "Poteri psichici",
            "Reincarnazione", "Città perduta Atlantis", "Teoria terra cava", "Chemtrails",
            "Dibattito terra piatta"
        ],
        es: [
            "¿Crees en aliens?", "Secretos gobierno...", "Avistamiento OVNI ayer",
            "Nos están vigilando", "Illuminati confirmado", "Raid Area 51 fue broma",
            "Matrix es real", "Vivimos en una simulación", "NASA miente", "¿Alunizaje fake?",
            "Gente lagarto", "Secretos CIA", "¿Bigfoot existe?", "Monstruo Loch Ness",
            "¿Viaje tiempo posible?", "Universos paralelos", "Historias caza fantasmas",
            "Criptozoología", "Aliens antiguos", "Círculos crop", "Triángulo Bermudas",
            "Experimentos MKUltra", "Incidente Roswell", "Hombres de negro", "Poderes psíquicos",
            "Reencarnación", "Ciudad perdida Atlantis", "Teoría tierra hueca", "Chemtrails",
            "Debate tierra plana"
        ],
        ko: [
            "외계인 믿어?", "정부 비밀...", "어제 UFO 목격",
            "그들이 우리를 지켜봐", "일루미나티 확인", "Area 51 레이드 농담",
            "매트릭스 실재", "시뮬레이션 속에 살아", "NASA 거짓말", "달 착륙 가짜?",
            "도마뱀 사람", "CIA 비밀", "빅풋 존재?", "로크 네스 괴물",
            "시간 여행 가능?", "평행 우주", "귀신 사냥 이야기",
            "암호생물학", "고대 외계인", "크롭 서클", "버뮤다 삼각지",
            "MKUltra 실험", "로스웰 사건", "맨 인 블랙", "초능력",
            "환생", "잃어버린 도시 아틀란티스", "속빈 지구 이론", "켐트레일",
            "평평한 지구 논쟁"
        ],
        ja: [
            "エイリアン信じる?", "政府の秘密...", "昨日UFO目撃",
            "彼らが監視してる", "イルミナティ確認", "Area 51レイドジョーク",
            "マトリックス実在", "シミュレーションに生きてる", "NASA嘘", "月着陸フェイク?",
            "リザードピープル", "CIA秘密", "ビッグフット存在?", "ネス湖怪物",
            "タイムトラベル可能?", "並行宇宙", "ゴーストハンティングストーリー",
            "クリプトズーオロジー", "古代エイリアン", "クロップサークル", "バミューダトライアングル",
            "MKUltra実験", "ロズウェル事件", "メンインブラック", "サイキックパワー",
            "転生", "失われた都市アトランティス", "中空地球理論", "ケムトレイル",
            "平らな地球議論"
        ],
        ru: [
            "Веришь в инопланетян?", "Секреты правительства...", "Вчера видели НЛО",
            "Они наблюдают за нами", "Иллюминати подтверждено", "Рейд на Area 51 был шуткой",
            "Матрица реальна", "Мы живем в симуляции", "NASA врет", "Посадка на луну фейк?",
            "Люди-ящерицы", "Секреты ЦРУ", "Бигфут существует?", "Монстр Лох-Несса",
            "Путешествие во времени возможно?", "Параллельные вселенные", "Истории охоты на привидений",
            "Криптозоология", "Древние инопланетяне", "Круги на полях", "Бермудский треугольник",
            "Эксперименты MKUltra", "Инцидент в Розуэлле", "Люди в черном", "Психические силы",
            "Реинкарнация", "Потерянный город Атлантида", "Теория полой земли", "Химтрейлы",
            "Дебаты плоской земли"
        ]
    },
    love: {
        en: [
            "M or F?", "Looking for gf", "Anyone want to date?", "Single here",
            "Send snap", "Age?", "From?", "Looking for love", "Hi beautiful",
            "Boyfriend wanted", "Just looking for fun", "M 22 here", "F 19 USA",
            "Any hot girls?", "Video chat?", "Snapchat?", "Insta?", "Looking for relationship",
            "Bored and single", "Flirt with me", "What's your type?", "Date ideas?",
            "Breakup advice", "Crush stories", "First kiss memory", "Romantic movies",
            "Love songs", "Long distance tips", "Jealousy issues", "Commitment fears",
            "Wedding dreams", "Baby names", "Honeymoon spots", "Anniversary ideas"
        ],
        pt: [
            "H ou M?", "Procurando namorada", "Alguém quer namorar?", "Solteiro aqui",
            "Manda snap", "Idade?", "De onde?", "Procurando amor", "Oi linda",
            "Namorado procurado", "Só procurando diversão", "H 22 aqui", "M 19 Brasil",
            "Alguma gata?", "Video chat?", "Snapchat?", "Insta?", "Procurando relacionamento",
            "Entediado e solteiro", "Flerta comigo", "Qual seu tipo?", "Ideias de date?",
            "Conselho de término", "Histórias de crush", "Memória primeiro beijo", "Filmes românticos",
            "Músicas de amor", "Dicas distância longa", "Problemas ciúmes", "Medos compromisso",
            "Sonhos casamento", "Nomes de bebê", "Lugares lua de mel", "Ideias aniversário"
        ],
        de: [
            "M oder F?", "Suche Freundin", "Will jemand daten?", "Single hier",
            "Schick Snap", "Alter?", "Von?", "Suche Liebe", "Hi Schöne",
            "Freund gesucht", "Nur Spaß suchen", "M 22 hier", "F 19 Deutschland",
            "Heiße Mädchen?", "Video Chat?", "Snapchat?", "Insta?", "Suche Beziehung",
            "Langweilig und single", "Flirte mit mir", "Was ist dein Typ?", "Date Ideen?",
            "Trennungsrat", "Crush Geschichten", "Erster Kuss Erinnerung", "Romantische Filme",
            "Liebeslieder", "Fernbeziehung Tipps", "Eifersucht Probleme", "Bindungsängste",
            "Hochzeitsträume", "Babynamen", "Flitterwochen Spots", "Jahrestag Ideen"
        ],
        fr: [
            "H ou F?", "Cherche copine", "Quelqu'un veut sortir?", "Célibataire ici",
            "Envoie snap", "Âge?", "De?", "Cherche amour", "Salut belle",
            "Copain voulu", "Juste pour fun", "H 22 ici", "F 19 France",
            "Des filles hot?", "Video chat?", "Snapchat?", "Insta?", "Cherche relation",
            "Ennuyé et célib", "Flirte avec moi", "Quel est ton type?", "Idées date?",
            "Conseil rupture", "Histoires crush", "Souvenir premier baiser", "Films romantiques",
            "Chansons amour", "Tips distance longue", "Problèmes jalousie", "Peurs engagement",
            "Rêves mariage", "Noms bébé", "Spots lune de miel", "Idées anniversaire"
        ],
        it: [
            "M o F?", "Cerco ragazza", "Qualcuno vuole uscire?", "Single qui",
            "Manda snap", "Età?", "Da?", "Cerco amore", "Ciao bella",
            "Fidanzato voluto", "Solo per fun", "M 22 qui", "F 19 Italia",
            "Ragazze hot?", "Video chat?", "Snapchat?", "Insta?", "Cerco relazione",
            "Annoiato e single", "Flirta con me", "Qual è il tuo tipo?", "Idee date?",
            "Consiglio rottura", "Storie crush", "Ricordo primo bacio", "Film romantici",
            "Canzoni amore", "Tips distanza lunga", "Problemi gelosia", "Paure impegno",
            "Sogni matrimonio", "Nomi bébé", "Spot luna di miele", "Idee anniversario"
        ],
        es: [
            "¿H o M?", "Buscando novia", "¿Alguien quiere salir?", "Soltero aquí",
            "Envía snap", "¿Edad?", "¿De?", "Buscando amor", "Hola hermosa",
            "Novio querido", "Solo buscando diversión", "H 22 aquí", "M 19 México",
            "¿Chicas hot?", "¿Video chat?", "Snapchat?", "Insta?", "Buscando relación",
            "Aburrido y soltero", "Flirtea conmigo", "¿Cuál es tu tipo?", "¿Ideas date?",
            "Consejo ruptura", "Historias crush", "Recuerdo primer beso", "Películas románticas",
            "Canciones amor", "Tips distancia larga", "Problemas celos", "Miedos compromiso",
            "Sueños boda", "Nombres bebé", "Spots luna de miel", "Ideas aniversario"
        ],
        ko: [
            "M or F?", "여친 찾음", "데이트 할 사람?", "싱글 여기",
            "스냅 보내", "나이?", "어디서?", "사랑 찾음", "안녕 아름다워",
            "남친 원함", "재미만 찾음", "M 22 여기", "F 19 한국",
            "핫 걸?", "비디오 채팅?", "Snapchat?", "Insta?", "관계 찾음",
            "지루하고 싱글", "나랑 플러트", "너 타입 뭐야?", "데이트 아이디어?",
            "이별 조언", "크러시 이야기", "첫 키스 기억", "로맨틱 영화",
            "러브 송", "장거리 팁", "질투 문제", "커밋먼트 공포",
            "웨딩 드림", "베이비 네임", "허니문 스팟", "기념일 아이디어"
        ],
        ja: [
            "M or F?", "彼女探し", "デートしたい人?", "シングルここ",
            "スナップ送って", "年齢?", "どこから?", "愛探し", "こんにちは美しい",
            "彼氏欲しい", "楽しいだけ", "M 22 ここ", "F 19 日本",
            "ホットガール?", "ビデオチャット?", "Snapchat?", "Insta?", "関係探し",
            "退屈でシングル", "私とフラート", "タイプ何?", "デートアイデア?",
            "別れアドバイス", "クラッシュストーリー", "ファーストキス記憶", "ロマンティック映画",
            "ラブソング", "長距離Tips", "嫉妬問題", "コミットメント恐れ",
            "ウェディングドリーム", "ベビーネーム", "ハネムーンスポット", "記念日アイデア"
        ],
        ru: [
            "М или Ж?", "Ищу девушку", "Кто-то хочет встречаться?", "Одинок здесь",
            "Пришли snap", "Возраст?", "Откуда?", "Ищу любовь", "Привет красивая",
            "Парень нужен", "Просто для fun", "М 22 здесь", "Ж 19 Россия",
            "Горячие девушки?", "Видео чат?", "Snapchat?", "Insta?", "Ищу отношения",
            "Скучно и одинок", "Флиртуй со мной", "Какой твой тип?", "Идеи свиданий?",
            "Совет расставания", "Истории крашей", "Воспоминание первого поцелуя", "Романтические фильмы",
            "Песни любви", "Tips дальние расстояния", "Проблемы ревности", "Страхи обязательств",
            "Мечты свадьбы", "Имена детей", "Места медового месяца", "Идеи годовщины"
        ]
    }
};

// --- DISTRIBUIÇÃO PELAS SALAS DO SIDEPANEL ---
// Corrigido "money" para "invest" para sincronizar com vocabulario
const roomDistribution = [
    { id: "global", count: 70 },
    { id: "love", count: 50 },
    { id: "nofilter", count: 30 },
    { id: "trending", count: 20 },
    { id: "invest", count: 10 },
    { id: "stories", count: 10 },
    { id: "area51", count: 10 },
];

// Função para adicionar variações humanas às mensagens (ex: emojis, erros de digitação aleatórios)
function humanizeMessage(msg) {
    const variations = [
        msg, // Original
        msg + " lol", // Adiciona lol
        msg + " haha", // Adiciona haha
        msg + " 😂", // Emoji
        msg + " 😊", // Emoji
        msg + "??", // Mais interrogativo
        msg.replace(/o/g, "0").replace(/i/g, "1"), // Erros de digitação simples
        msg.toLowerCase(), // Tudo minúsculo para casual
        msg + "...", // Pensativo
    ];
    return variations[Math.floor(Math.random() * variations.length)];
}

function createBot(botName, roomId, botIndex) {
    setTimeout(() => {
        const socket = io(SERVER_URL, {
            reconnection: true,
            transports: ['websocket'],
            forceNew: true
        });

        const gender = Math.random() > 0.5 ? "male" : "female";
        const country = countries[Math.floor(Math.random() * countries.length)];
        const lang = countryToLang[country] || "en"; // Default para en se não mapeado

        socket.on("connect", () => {
            // Entrar na sala usando a mesma estrutura do SidePanel.tsx
            socket.emit("join_room", {
                room: roomId,
                username: botName,
                gender: gender,
                country: country
            });
        });

        const loopFala = () => {
            const delay = Math.floor(Math.random() * (100000 - 30000) + 30000);

            setTimeout(() => {
                if (socket.connected) {
                    let listaMsgs;
                    if (vocabulario[roomId] && vocabulario[roomId][lang]) {
                        listaMsgs = vocabulario[roomId][lang];
                    } else if (vocabulario[roomId] && vocabulario[roomId]["en"]) {
                        listaMsgs = vocabulario[roomId]["en"];
                    } else {
                        listaMsgs = vocabulario["global"]["en"];
                    }
                    let msgTexto = listaMsgs[Math.floor(Math.random() * listaMsgs.length)];
                    msgTexto = humanizeMessage(msgTexto); // Humaniza a mensagem

                    socket.emit("send_message", {
                        room: roomId,
                        senderName: botName,
                        sender: "user",
                        senderCountry: country,
                        senderGender: gender,
                        text: msgTexto,
                        timestamp: Date.now(),
                        id: "ghost-" + Date.now() + Math.random()
                    });

                    loopFala();
                }
            }, delay);
        };
        loopFala();

    }, botIndex * 150);
}

console.log(`🚀 Iniciando bots para as salas oficiais...`);

let botCounter = 0;
roomDistribution.forEach(dist => {
    for (let i = 0; i < dist.count; i++) {
        const uniqueName = `${names[Math.floor(Math.random() * names.length)]}_${Math.floor(Math.random() * 99)}`;
        createBot(uniqueName, dist.id, botCounter);
        botCounter++;
    }
});