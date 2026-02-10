// ghosts.js - Simulação de Tráfego (Versão ES Module)
import { io } from "socket.io-client";

// --- CONFIGURAÇÃO ---
const SERVER_URL = "https://loouz-oficial-final.onrender.com"; // Confirme se sua URL é esta
const TOTAL_BOTS = 40;

// --- LISTA DE NOMES (Parecem reais de redes sociais) ---
const names = [
    "Sarah_US", "Mike88", "LonelyBoy", "Anna_K", "Pedro_BR", "CryptoKing", "SadGirl22",
    "JohnDoe", "Vivi_L", "GamerX", "Alex_Fr", "Maria_S", "Tored_Guy", "ChillVibes",
    "Emma_Watson_Fan", "Lukas_Ger", "Jap_User", "Korean_Bts", "Nina_R", "Carlos_Mx",
    "Stranger001", "Anon_User", "WebMaster", "Love_Seeker", "Invest_Bro", "Tech_Guy",
    "MusicLover", "Artist_X", "Dreamer", "NightOwl", "Sunshine", "Moonlight",
    "AlphaWolf", "BetaTester", "Charlie", "DeltaForce", "Echo_Location", "Foxtrot"
];

// --- VOCABULÁRIO POR SALA ---
const vocabulario = {
    global: [
        "Hello everyone!", "Anyone from USA here?", "So bored right now...",
        "Where are you guys from?", "Hi from Brazil!", "Hola a todos",
        "This site is better than Omegle", "Anyone wanna video chat?",
        "Salve galera", "Bonjour", "Is this real?", "Looking for friends",
        "What time is it for you?", "I should be studying lol", "Cool design here"
    ],
    trending: [
        "Did you see the news?", "Viral video on TikTok is crazy", "Twitter is on fire today",
        "What is trending now?", "Anyone watching the game?", "O que tá pegando?",
        "Omg I can't believe that happened", "Meme of the day lol", "Trends change so fast"
    ],
    invest: [
        "BTC going to the moon 🚀", "Anyone into Nvidia stocks?", "Buy the dip!",
        "Crypto is crashing again?", "Hold or sell?", "Forex trading anyone?",
        "Qual a boa de hoje?", "ETH is solid", "Bear market is over", "Investment tips?"
    ],
    nofilter: [
        "Unpopular opinion: Pizza with pineapple is good", "Lets debate", "Trump or Biden?",
        "Politics are boring", "Tell me a secret", "Fale o que quiser",
        "Freedom of speech here", "I hate mondays", "Truth or dare?"
    ],
    stories: [
        "I have a confession...", "My day was terrible", "Let me tell you a story",
        "Once upon a time...", "Alguém pra desabafar?", "Need advice on my relationship",
        "Scary stories anyone?", "Life is hard sometimes", "Just broke up :("
    ],
    area51: [
        "Do you believe in aliens?", "Government secrets...", "UFO sighting yesterday",
        "They are watching us", "Illuminati confirmed", "Area 51 raid was a joke",
        "Matrix is real", "We are living in a simulation", "OVNIs existem?"
    ],
    love: [
        "M or F?", "Looking for gf", "Anyone want to date?", "Single here",
        "Send snap", "Age?", "From?", "Looking for love", "Alguém solteiro?",
        "Hi beautiful", "Boyfriend wanted", "Just looking for fun"
    ]
};

// --- CONFIGURAÇÃO DE DISTRIBUIÇÃO ---
const roomDistribution = [
    { id: "global", count: 10 },
    { id: "love", count: 8 },
    { id: "nofilter", count: 5 },
    { id: "trending", count: 4 },
    { id: "stories", count: 4 },
    { id: "invest", count: 3 },
    { id: "area51", count: 2 },
];

// --- FUNÇÃO PARA CRIAR UM BOT ---
function createBot(botName, roomId) {
    const socket = io(SERVER_URL, {
        reconnection: true,
        reconnectionDelay: 5000,
        transports: ['websocket']
    });

    const gender = Math.random() > 0.5 ? "male" : "female";

    socket.on("connect", () => {
        socket.emit("join_room", {
            room: roomId,
            username: botName,
            gender: gender
        });
    });

    const loopFala = () => {
        // Fala a cada 15 a 60 segundos
        const delay = Math.floor(Math.random() * (60000 - 15000) + 15000);

        setTimeout(() => {
            if (socket.connected) {
                const listaMsgs = vocabulario[roomId] || vocabulario["global"];
                const msgTexto = listaMsgs[Math.floor(Math.random() * listaMsgs.length)];

                socket.emit("send_message", {
                    room: roomId,
                    senderName: botName,
                    sender: "user",
                    senderCountry: Math.random() > 0.7 ? "BR" : "US",
                    senderGender: gender,
                    text: msgTexto,
                    timestamp: Date.now(),
                    id: "ghost-" + Date.now() + Math.random()
                });

                loopFala(); // Repete o ciclo
            }
        }, delay);
    };

    loopFala();
}

// --- INICIALIZAÇÃO ---
console.log("🚀 Iniciando Protocolo Ghost (Modo ES Modules)...");

let botsLaunched = 0;

roomDistribution.forEach(dist => {
    for (let i = 0; i < dist.count; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        // Adiciona um numero aleatório para não ter nicks duplicados exatos
        const uniqueName = `${name}_${Math.floor(Math.random() * 99)}`;

        createBot(uniqueName, dist.id);
        botsLaunched++;
    }
});

console.log(`✅ Total de ${botsLaunched} bots ativos espalhados pelas salas.`);