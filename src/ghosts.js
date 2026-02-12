// ghosts.js - Simulação de Tráfego para SidePanel e Rooms
import { io } from "socket.io-client";

// --- CONFIGURAÇÃO ---
const SERVER_URL = "https://loouz-oficial-final.onrender.com";
const TOTAL_BOTS = 200;

const countries = [
    "US", "BR", "GB", "CA", "DE", "FR", "IT", "ES", "MX", "IN", "KR", "JP", "RU", "AU"
];

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

// --- VOCABULÁRIO SINCRONIZADO COM AS NOVAS SALAS ---
const vocabulario = {
    global: [
        "Hello everyone!", "Anyone from USA here?", "So bored right now...",
        "Where are you guys from?", "Hi from Brazil!", "Hola a todos",
        "This site is better than Omegle", "Anyone wanna video chat?",
        "Salve galera", "Bonjour", "Is this real?", "Looking for friends",
        "What time is it for you?", "I should be studying lol", "Cool design here",
        "Anyone from Europe?", "I miss Omegle but this is cool", "Hello from Germany",
        "Konnichiwa", "Any girls here?", "Im from London", "Bored af",
        "Alguem BR?", "Hola desde Mexico", "Who wants to talk?", "M or F?",
        "Video?", "Skip", "Next", "Lol", "Wtf", "Cool", "Hi", "Hello"
    ],
    trending: [
        "Did you see the news?", "Viral video on TikTok is crazy", "Twitter is on fire today",
        "What is trending now?", "Anyone watching the game?", "O que tá pegando?",
        "Omg I can't believe that happened", "Meme of the day lol", "Trends change so fast",
        "Elon Musk is crazy", "Taylor Swift new album?", "World cup coming",
        "GTA VI trailer?", "AI is scary", "Bitcoin or solana?", "Netflix series recommendation?"
    ],
    invest: [
        "BTC going to the moon 🚀", "Anyone into Nvidia stocks?", "Buy the dip!",
        "Crypto is crashing again?", "Hold or sell?", "Forex trading anyone?",
        "Qual a boa de hoje?", "ETH is solid", "Bear market is over", "Investment tips?",
        "Solana is pumping", "NFTs are dead?", "Day trade is hard", "HODL",
        "Stock market open?", "S&P500 analysis"
    ],
    nofilter: [
        "Unpopular opinion: Pizza with pineapple is good", "Lets debate", "Trump or Biden?",
        "Politics are boring", "Tell me a secret", "Fale o que quiser",
        "Freedom of speech here", "I hate mondays", "Truth or dare?",
        "Earth is flat (joke)", "Aliens exist", "Simulation theory",
        "Change my mind", "Roast me", "F*ck it"
    ],
    stories: [
        "I have a confession...", "My day was terrible", "Let me tell you a story",
        "Once upon a time...", "Alguém pra desabafar?", "Need advice on my relationship",
        "Scary stories anyone?", "Life is hard sometimes", "Just broke up :(",
        "I saw a ghost once", "My boss hates me", "School is stressing me out",
        "I think I'm in love", "Advice needed pls"
    ],
    area51: [
        "Do you believe in aliens?", "Government secrets...", "UFO sighting yesterday",
        "They are watching us", "Illuminati confirmed", "Area 51 raid was a joke",
        "Matrix is real", "We are living in a simulation", "OVNIs existem?",
        "NASA lies", "Moon landing fake?", "Lizard people", "CIA secrets"
    ],
    love: [
        "M or F?", "Looking for gf", "Anyone want to date?", "Single here",
        "Send snap", "Age?", "From?", "Looking for love", "Alguém solteiro?",
        "Hi beautiful", "Boyfriend wanted", "Just looking for fun",
        "M 22 here", "F 19 USA", "Any hot girls?", "Video chat?",
        "Snapchat?", "Insta?", "Looking for relationship", "Bored and single"
    ]
};

// --- DISTRIBUIÇÃO PELAS SALAS DO SIDEPANEL ---
const roomDistribution = [
    { id: "global", count: 70 },
    { id: "love", count: 50 },
    { id: "nofilter", count: 30 },
    { id: "trending", count: 20 },
    { id: "money", count: 10 },
    { id: "stories", count: 10 },
    { id: "area51", count: 10 },
];

function createBot(botName, roomId, botIndex) {
    setTimeout(() => {
        const socket = io(SERVER_URL, {
            reconnection: true,
            transports: ['websocket'],
            forceNew: true
        });

        const gender = Math.random() > 0.5 ? "male" : "female";
        const country = countries[Math.floor(Math.random() * countries.length)];

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
                    const listaMsgs = vocabulario[roomId] || vocabulario["global"];
                    const msgTexto = listaMsgs[Math.floor(Math.random() * listaMsgs.length)];

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