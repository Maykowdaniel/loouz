const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// --- MEMÓRIA DO SERVIDOR ---
const activeUsers = new Map(); // Para salas de grupo

// Memória de Vídeo
let videoQueue = [];
const videoPairs = new Map();

// Memória de Texto 1v1
let textQueue = [];
const textPairs = new Map(); // Mapeia socket.id -> { partnerId, roomId, isBot }
const textUsers = new Map(); // Guarda nome/país

// --- LÓGICA DOS BOTS (NOVO) ---
const BOT_TIMEOUT_MS = 9000; // Tempo de espera até o bot entrar (9 segundos)
const userBotTimers = new Map(); // Guarda os timers de espera de cada usuário

// Roteiros dos Bots (Scripts)
const BOT_SCRIPTS = [
    // ────────────────────────────────────────────────
    // TIPO 1 – Americano clássico preguiçoso (muito comum)
    {
        type: 'classic_us',
        probability: 0.22,
        country: 'US',
        name: 'Stranger',
        gender: 'male',
        ageRange: '18-24',
        firstMessages: [
            { text: "m", delay: 1400 },
            { text: "u?", delay: 2800 },
            { text: "from?", delay: 2200 },
            { text: "asl?", delay: 1800 },
            { text: "hey", delay: 1200 }
        ],
        possibleReplies: [
            "cool", "same", "nice", "wbu", "not bad", "lmfao", "haha", "bruh",
            "fr", "cap", "no cap", "bet", "sus", "deadass", "sheesh", "rizz",
            "skibidi", "gyatt", "ohio", "sigma", "slay", "periodt", "lowkey", "highkey",
            "tbh", "idk", "kinda", "meh", "based", "cringe", "lit", "fire",
            "goated", "mid", "bussin", "slaps", "ate", "pookie", "rizzler"
        ],
        exitPhrases: [
            "brb mom calling", "g2g", "boring", "gn", "later", "bye", "k",
            "ttyl", "cya", "afk", "gotta dip", "peace", "out", "catch u later",
            "sleepy af", "this is mid", "nah im out", "family stuff", "work rn"
        ]
    },

    // ────────────────────────────────────────────────
    // TIPO 2 – Brasileira falante / curiosa (muito realista no Omegle BR)
    {
        type: 'br_talkative',
        probability: 0.18,
        country: 'BR',
        name: 'Anônima',
        gender: 'female',
        ageRange: '16-22',
        firstMessages: [
            { text: "oiii", delay: 1100 },
            { text: "td bem?", delay: 2400 },
            { text: "de onde vc é?", delay: 2800 },
            { text: "e aí?", delay: 1500 },
            { text: "oi gatinho", delay: 1900 },
            { text: "kakaka oi", delay: 1300 }
        ],
        possibleReplies: [
            "nossa sério?", "kakakaka", "amei", "que issooo", "mentiraaa", "afff",
            "gostei de vc", "vc é de boa?", "ta fazendo oq agr?", "dorme cedo?",
            "gosta de netflix?", "qual sua idade mesmo?", "pqp que top", "kkkkk para",
            "sério isso??", "nossa que fofo", "amei sua vibe", "vc é engraçado",
            "blz então", "ta afim de algo?", "manda foto sua?", "rola um date?",
            "vc joga free fire?", "adiciona no insta?", "tmj ai", "aff que saudade",
            "to com sono já kkk", "minha mãe ta chamando", "vou tomar banho",
            "depois a gente fala", "tchauzinho fofo", "te adicionei no wpp?",
            "vc é mineiro? kkk", "sou de sp, e vc?", "gosta de funk?", "rola um rolezinho?"
        ],
        exitPhrases: [
            "to com sono já", "minha mãe ta chamando", "tenho que ir", "vou tomar banho",
            "depois a gente fala", "tchauzinho", "blz então", "falou", "tmj",
            "vamo ser amigos", "vou nessa", "pqp to cansada", "net caiu", "mãe gritando",
            "sono veio forte", "ate mais tarde", "tchau amorzinho", "beijos", "até o proximo"
        ]
    },

    // ────────────────────────────────────────────────
    // TIPO 3 – Indiano clássico (muito frequente)
    {
        type: 'indian_meme',
        probability: 0.15,
        country: 'IN',
        name: 'Stranger',
        gender: 'male',
        ageRange: '19-27',
        firstMessages: [
            { text: "helo", delay: 1300 },
            { text: "how r u", delay: 2100 },
            { text: "where r u from", delay: 2600 },
            { text: "which country?", delay: 3400 },
            { text: "hi bro", delay: 1600 },
            { text: "namaste", delay: 2000 }
        ],
        possibleReplies: [
            "nice", "cool bro", "very good", "i like", "u have gf?", "u sexy?",
            "show face?", "pic plz", "age?", "asl bro", "u single?", "wanna be frnds?",
            "bobs and vegana", "which state?", "delhi?", "mumbai?", "i love u",
            "send photo", "u beautiful", "very nice", "good morning", "how old u?",
            "u married?", "i am engineer", "u student?", "nice to meet", "plz reply"
        ],
        exitPhrases: [
            "sorry mom calling", "net slow", "bye friend", "talk later", "disconnecting",
            "duty time", "exam tomorrow", "family calling", "battery low", "sleep time",
            "see u", "namaste bye", "good night", "take care bro"
        ]
    },

    // ────────────────────────────────────────────────
    // TIPO 4 – Adolescente skip rápido (muito real)
    {
        type: 'quick_skipper',
        probability: 0.14,
        country: ['BR', 'AR', 'MX', 'CL'][Math.floor(Math.random() * 4)],
        name: 'Stranger',
        gender: ['male', 'female'][Math.floor(Math.random() * 2)],
        firstMessages: [
            { text: Math.random() > 0.5 ? "oi" : "ola", delay: 900 },
            { text: "hi", delay: 700 },
            { text: "e aí", delay: 1100 },
            { text: "hola", delay: 800 }
        ],
        possibleReplies: [
            "tchau", "skip", "nn", "tô saindo", "aff", "que isso", "não", "bye",
            "k", "ok", "nah", "pass", "next", "boring", "fake", "lol no",
            "tô full", "deixa", "vou pular", "não curti"
        ],
        exitChanceAfterFirst: 0.80,
        exitPhrases: ["tchau", "skip", "nn", "tô saindo", "bye", "pulei", "não"]
    },

    // ────────────────────────────────────────────────
    // TIPO 5 – Garota simpática que conversa um pouco mais
    {
        type: 'friendly_girl',
        probability: 0.12,
        country: ['GB', 'CA', 'AU', 'NZ', 'US'][Math.floor(Math.random() * 5)],
        name: 'Stranger',
        gender: 'female',
        ageRange: '17-23',
        firstMessages: [
            { text: "heyyy", delay: 1200 },
            { text: "how are you?", delay: 2600 },
            { text: "what brings you here?", delay: 3200 },
            { text: "hi there!", delay: 1400 },
            { text: "hey cutie", delay: 1800 },
            { text: "sup?", delay: 1000 }
        ],
        possibleReplies: [
            "that's cool", "omg same", "really?", "haha yeah", "no way", "that's crazy",
            "what kind of music do you like?", "favourite show?", "are you single? lol",
            "me too!", "love that", "same here", "tell me more", "sounds fun",
            "aww cute", "lol true", "you're funny", "where you from?", "age?",
            "nice to meet u", "wanna be friends?", "lol same vibe", "this is fun"
        ],
        exitPhrases: [
            "gotta go eat", "friends calling me", "talk soon maybe?", "bye cutie ;)",
            "this was fun!", "gotta run", "chat later?", "ttyl", "love chatting",
            "bye for now", "see ya", "have a good day"
        ]
    },

    // ────────────────────────────────────────────────
    // TIPO 6 – Pervert guy (comum e chato – baixa probabilidade)
    {
        type: 'horny_dude',
        probability: 0.08,
        country: ['US', 'FR', 'DE', 'TR'][Math.floor(Math.random() * 4)],
        name: 'Stranger',
        gender: 'male',
        firstMessages: [
            { text: "hi baby", delay: 1000 },
            { text: "asl?", delay: 1800 },
            { text: "u cute?", delay: 2500 },
            { text: "hey sexy", delay: 1300 },
            { text: "wanna cam?", delay: 2100 }
        ],
        possibleReplies: [
            "show tits", "send pic", "age?", "snap?", "where u live", "horny?",
            "wanna cam?", "u single?", "send nudes", "what u wearing?", "u hot?",
            "dick pic?", "tits or ass?", "feet?", "roleplay?", "dirty talk?"
        ],
        exitPhrases: ["ur boring", "no fun", "fake", "bye loser", "k bye", "whatever",
            "ur a bot", "not my type", "next"
        ]
    },

    // ────────────────────────────────────────────────
    // TIPO 7 – "Ei quero ser seu amigo" (muito BR)
    {
        type: 'quer_amizade',
        probability: 0.11,
        country: 'BR',
        name: 'Stranger',
        gender: ['male', 'female'][Math.floor(Math.random() * 2)],
        firstMessages: [
            { text: "e ai", delay: 1100 },
            { text: "posso ser seu amigo?", delay: 2600 },
            { text: "oi amigo", delay: 1400 },
            { text: "quer amizade?", delay: 1900 }
        ],
        possibleReplies: [
            "gosta de amizade?", "qual tua idade", "joga free fire?", "vc é legal",
            "adiciona no insta?", "tmj", "blz", "vamos trocar ideia", "me conta mais",
            "vc é de boa?", "rola um papo?", "sou de sp, e vc?", "gosta de anime?",
            "vamos jogar juntos?", "adiciona no discord?", "quero ser seu amigo de verdade"
        ],
        exitPhrases: ["blz então", "falou", "tmj", "vamo ser amigos", "ate mais",
            "falou mano", "beijos", "tchau", "vou nessa"
        ]
    }
];
// Função auxiliar para pegar país pelo IP
function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

function getRoomCount(room) {
    const roomSet = io.sockets.adapter.rooms.get(room);
    return roomSet ? roomSet.size : 0;
}

// --- FUNÇÃO PARA INICIAR UM BOT ---
function startBotChat(socketId) {
    const userSocket = io.sockets.sockets.get(socketId);
    if (!userSocket || textPairs.has(socketId)) return; // Se já estiver pareado, cancela

    // Remove o usuário da fila real (para ele não dar match com humano enquanto fala com bot)
    textQueue = textQueue.filter(id => id !== socketId);

    // Escolhe um script aleatório
    const script = BOT_SCRIPTS[Math.floor(Math.random() * BOT_SCRIPTS.length)];
    const botId = `bot-${Date.now()}`;
    const roomId = `text-room-${socketId}-${botId}`;

    userSocket.join(roomId);

    // Salva que o usuário está falando com um bot
    textPairs.set(socketId, { partnerId: botId, roomId, isBot: true });

    // 1. Avisa o usuário que conectou
    io.to(socketId).emit("text_paired", {
        roomId,
        partnerName: "Stranger",
        partnerCountry: script.country,
        partnerGender: script.gender
    });

    // 2. Executa o Roteiro do Bot
    let currentTime = 0;

    script.messages.forEach((msg, index) => {
        currentTime += msg.delay;

        setTimeout(() => {
            // Verifica se o usuário AINDA está conectado e falando com ESSE bot
            const pair = textPairs.get(socketId);
            if (pair && pair.partnerId === botId) {
                // Simula envio de mensagem
                io.to(roomId).emit("receive_1v1_message", {
                    text: msg.text,
                    sender: "stranger", // Frontend vai interpretar como estranho
                    senderId: botId,
                    timestamp: Date.now(),
                    id: `msg-${Date.now()}-${index}`
                });

                // Se for a última mensagem, desconecta o bot depois de um tempinho
                if (index === script.messages.length - 1) {
                    setTimeout(() => {
                        const currentPair = textPairs.get(socketId);
                        if (currentPair && currentPair.partnerId === botId) {
                            io.to(socketId).emit("text_partner_disconnected");
                            textPairs.delete(socketId);
                            userSocket.leave(roomId);
                        }
                    }, 2000); // Espera 2s depois da última fala para sair
                }
            }
        }, currentTime);
    });
}


io.on("connection", (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    // --- 1. CHAT DE SALAS (QUARTOS) ---
    socket.on("join_room", (data) => {
        const { room, username, gender, country } = data;
        socket.join(room);
        const finalCountry = country || getCountryByIp(socket);

        // Limpa filas anteriores
        videoQueue = videoQueue.filter(id => id !== socket.id);
        textQueue = textQueue.filter(id => id !== socket.id);
        if (userBotTimers.has(socket.id)) {
            clearTimeout(userBotTimers.get(socket.id));
            userBotTimers.delete(socket.id);
        }

        activeUsers.set(socket.id, { username, room, country: finalCountry, gender });

        socket.to(room).emit("receive_message", {
            id: "sys-" + Date.now(),
            sender: "system",
            senderName: "Sistema",
            text: `${username} entrou na sala.`,
            timestamp: Date.now()
        });
        const count = getRoomCount(room);
        io.to(room).emit("room_meta", { count });
    });

    socket.on("send_message", (data) => {
        const user = activeUsers.get(socket.id);
        const senderCountry = user ? user.country : 'UN';
        const senderGender = user ? user.gender : 'unspecified';
        const messageWithDetails = {...data, senderCountry, senderGender };
        io.to(data.room).emit("receive_message", messageWithDetails);
    });

    // --- 2. VÍDEO 1v1 (SEM BOTS POR ENQUANTO) ---
    socket.on("join_video_queue", () => {
        // Limpa timer de bot se existir
        if (userBotTimers.has(socket.id)) {
            clearTimeout(userBotTimers.get(socket.id));
            userBotTimers.delete(socket.id);
        }

        const currentPartner = videoPairs.get(socket.id);
        if (currentPartner) {
            io.to(currentPartner).emit("partner_disconnected");
            videoPairs.delete(currentPartner);
            videoPairs.delete(socket.id);
        }
        videoQueue = videoQueue.filter(id => id !== socket.id);

        if (videoQueue.length > 0) {
            const partnerSocketId = videoQueue.shift();
            if (partnerSocketId === socket.id) {
                videoQueue.push(socket.id);
                return;
            }
            videoPairs.set(socket.id, partnerSocketId);
            videoPairs.set(partnerSocketId, socket.id);
            io.to(partnerSocketId).emit("start_call", { socketId: socket.id, initiator: true });
            io.to(socket.id).emit("start_call", { socketId: partnerSocketId, initiator: false });
        } else {
            videoQueue.push(socket.id);
        }
    });

    socket.on("send_signal", ({ userToCall, signalData }) => {
        io.to(userToCall).emit("receive_signal", { signal: signalData });
    });

    // --- 3. CHAT DE TEXTO 1V1 (AGORA COM BOTS) ---
    socket.on("join_text_queue", (userData) => {
        const { name, gender, country } = userData || { name: "Estranho", gender: "unspecified" };
        const finalCountry = country || getCountryByIp(socket);
        textUsers.set(socket.id, { name, gender, country: finalCountry });

        // 1. Limpa conexões antigas (se estava falando com alguém ou bot)
        const oldPair = textPairs.get(socket.id);
        if (oldPair) {
            if (!oldPair.isBot) {
                io.to(oldPair.partnerId).emit("text_partner_disconnected");
                textPairs.delete(oldPair.partnerId);
            }
            textPairs.delete(socket.id);
        }

        // 2. Limpa timer anterior se o usuário clicou "Skip" rápido
        if (userBotTimers.has(socket.id)) {
            clearTimeout(userBotTimers.get(socket.id));
            userBotTimers.delete(socket.id);
        }

        // 3. Tenta parear com HUMANO primeiro
        textQueue = textQueue.filter(id => id !== socket.id);

        if (textQueue.length > 0) {
            // ACHOU HUMANO!
            const partnerId = textQueue.shift();

            // Se o parceiro estava esperando um bot, CANCELA o bot dele
            if (userBotTimers.has(partnerId)) {
                clearTimeout(userBotTimers.get(partnerId));
                userBotTimers.delete(partnerId);
            }

            if (partnerId === socket.id) {
                textQueue.push(socket.id);
                return;
            }

            const roomId = `text-room-${socket.id}-${partnerId}`;
            socket.join(roomId);
            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) partnerSocket.join(roomId);

            textPairs.set(socket.id, { partnerId, roomId, isBot: false });
            textPairs.set(partnerId, { partnerId: socket.id, roomId, isBot: false });

            const myData = textUsers.get(socket.id);
            const partnerData = textUsers.get(partnerId);

            io.to(socket.id).emit("text_paired", {
                roomId,
                partnerName: (partnerData && partnerData.name) ? partnerData.name : "Estranho",
                partnerCountry: (partnerData && partnerData.country) ? partnerData.country : "UN"
            });
            io.to(partnerId).emit("text_paired", {
                roomId,
                partnerName: (myData && myData.name) ? myData.name : "Estranho",
                partnerCountry: (myData && myData.country) ? myData.country : "UN"
            });

        } else {
            // NÃO ACHOU HUMANO -> Entra na fila e inicia o timer do BOT
            textQueue.push(socket.id);

            console.log(`Usuário ${socket.id} na fila. Bot em ${BOT_TIMEOUT_MS/1000}s...`);

            const botTimer = setTimeout(() => {
                // Se o timer estourar, inicia o bot
                startBotChat(socket.id);
            }, BOT_TIMEOUT_MS);

            userBotTimers.set(socket.id, botTimer);
        }
    });

    socket.on("send_1v1_message", (data) => {
        const pair = textPairs.get(socket.id);
        if (pair) {
            // Se for bot, a mensagem vai pro limbo (mas podemos logar se quiser)
            // Se for humano, vai pro roomId
            if (!pair.isBot) {
                io.to(pair.roomId).emit("receive_1v1_message", {
                    ...data,
                    sender: socket.id === data.senderId ? "user" : "stranger"
                });
            } else {
                // Se estou falando com bot, só eu vejo minha mensagem (o frontend já mostra)
                // O bot não precisa "receber" nada, ele só segue o script
            }
        }
    });

    // --- 4. DESCONEXÃO ---
    socket.on("disconnect", () => {
        textUsers.delete(socket.id);

        // Limpa timer de bot
        if (userBotTimers.has(socket.id)) {
            clearTimeout(userBotTimers.get(socket.id));
            userBotTimers.delete(socket.id);
        }

        videoQueue = videoQueue.filter(id => id !== socket.id);
        const vidPartner = videoPairs.get(socket.id);
        if (vidPartner) {
            io.to(vidPartner).emit("partner_disconnected");
            videoPairs.delete(vidPartner);
            videoPairs.delete(socket.id);
        }

        textQueue = textQueue.filter(id => id !== socket.id);
        const txtPair = textPairs.get(socket.id);
        if (txtPair) {
            if (!txtPair.isBot) {
                io.to(txtPair.partnerId).emit("text_partner_disconnected");
                textPairs.delete(txtPair.partnerId);
            }
            textPairs.delete(socket.id);
        }

        const user = activeUsers.get(socket.id);
        if (user) {
            io.to(user.room).emit("receive_message", {
                id: "sys-" + Date.now(),
                sender: "system",
                senderName: "Sistema",
                text: `${user.username} saiu da sala.`,
                timestamp: Date.now()
            });
            activeUsers.delete(socket.id);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVIDOR ARRUAMADO RODANDO NA PORTA ${PORT}`);
});