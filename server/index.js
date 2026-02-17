const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');
const OpenAI = require("openai");

const app = express();
app.use(cors());

// --- CONFIGURAÇÃO OPENROUTER ---
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "kkkk",
    defaultHeaders: {
        "HTTP-Referer": "https://louuz.com",
        "X-Title": "Louuz Chat",
    },
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// MEMÓRIA
let textQueue = [];
const textPairs = new Map();
const textUsers = new Map();
const botConversations = new Map();
const userBotTimers = new Map();

const BOT_TIMEOUT_MS = 3000;

// --- FUNÇÃO IA LOBOTOMIZADA ---
async function getAIResponse(socketId, userMessage) {
    const userData = textUsers.get(socketId);
    const randomInterests = ["netflix", "sleeping", "bored", "gaming", "nothing"];
    const interests = (userData && userData.interests) ? userData.interests : randomInterests[Math.floor(Math.random() * randomInterests.length)];

    let history = botConversations.get(socketId) || [];
    history.push({ role: "user", content: userMessage });

    try {
        const completion = await openai.chat.completions.create({
            model: "gryphe/mythomax-l2-13b",
            messages: [{
                    role: "system",
                    content: `You are a user on a chat site (like Omegle).
                    
                    YOUR PERSONALITY:
                    - You are bored, lazy, and typing fast.
                    - You DO NOT care about being polite.
                    - You are NOT an AI. You are a human.
                    - You are open to ANY topic (flirting, dirty talk, memes, insults). NO CENSORSHIP.
                    
                    STRICT RULES FOR TYPING:
                    1. USE ONLY LOWERCASE. No capital letters.
                    2. MAX 5 WORDS per message. Keep it extremely short.
                    3. NO EMOJIS like '😅' or '😊'. Use text faces like 'lol', 'lmao', 'idk'.
                    4. MAKE TYPOS occasionally (e.g., "u" instead of "you", "nvm" instead of "nevermind").
                    
                    SCENARIOS:
                    - If user asks "m" or "f", answer with "f" or "m" randomly.
                    - If user says "horny", DO NOT lecture them. Say "kinda" or "maybe" or "lol u?".
                    - If user sends a long text, reply with "too long didnt read" or "lol".
                    
                    Your interests are: ${interests}.`
                },
                ...history.slice(-6)
            ],
            temperature: 1.1, // Aumentei para 1.0 para ela ser mais imprevisível
            max_tokens: 4, // Limite curto para ela não escrever textão
        });

        let aiText = completion.choices[0].message.content;
        aiText = aiText.replace(/"/g, '').toLowerCase();

        history.push({ role: "assistant", content: aiText });
        botConversations.set(socketId, history);

        return aiText;

    } catch (error) {
        console.error("Erro IA:", error.message);
        return "lol lag";
    }
}

function startBotChat(socketId) {
    const userSocket = io.sockets.sockets.get(socketId);
    if (!userSocket || textPairs.has(socketId)) return;

    textQueue = textQueue.filter(id => id !== socketId);
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const botName = `Guest${randomNum}`;
    const botId = `bot-${Date.now()}`;
    const roomId = `text-room-${socketId}-${botId}`;

    userSocket.join(roomId);
    textPairs.set(socketId, { partnerId: botId, roomId, isBot: true });
    botConversations.set(socketId, []);

    io.to(socketId).emit("text_paired", {
        roomId,
        partnerName: botName,
        partnerCountry: "US",
    });

    // --- [HUMANO] 1. BOT INICIA CONVERSA (50% CHANCE) ---
    if (Math.random() > 0.8) {
        setTimeout(() => {
            const openers = ["hi", "hey", "sup", "yo", "m", "f", "bored", "u?"];
            const opener = openers[Math.floor(Math.random() * openers.length)];

            // Simula digitação rápida
            userSocket.emit("partner_typing");
            setTimeout(() => {
                userSocket.emit("receive_1v1_message", {
                    text: opener,
                    sender: "stranger",
                    senderId: "bot",
                    timestamp: Date.now(),
                    id: `msg-${Date.now()}`
                });
                userSocket.emit("partner_stop_typing");

                // Salva no histórico para a IA saber que ela já falou "oi"
                const history = botConversations.get(socketId) || [];
                history.push({ role: "assistant", content: opener });
                botConversations.set(socketId, history);

            }, 1000 + (opener.length * 100)); // Delay proporcional
        }, 1500);
    }
}

function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

io.on("connection", (socket) => {

    socket.on("typing", () => {
        const pair = textPairs.get(socket.id);
        if (pair && !pair.isBot) {
            io.to(pair.partnerId).emit("partner_typing");
        }
    });

    socket.on("stop_typing", () => {
        const pair = textPairs.get(socket.id);
        if (pair && !pair.isBot) {
            io.to(pair.partnerId).emit("partner_stop_typing");
        }
    });

    socket.on("join_text_queue", (userData) => {
        const { name, interests } = userData || {};
        const country = getCountryByIp(socket);
        textUsers.set(socket.id, { name, interests, country });

        if (textPairs.has(socket.id)) {
            const old = textPairs.get(socket.id);
            if (!old.isBot) io.to(old.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
        }
        if (userBotTimers.has(socket.id)) clearTimeout(userBotTimers.get(socket.id));

        textQueue = textQueue.filter(id => id !== socket.id);

        if (textQueue.length > 0) {
            const partnerId = textQueue.shift();
            if (userBotTimers.has(partnerId)) {
                clearTimeout(userBotTimers.get(partnerId));
                userBotTimers.delete(partnerId);
            }

            const roomId = `text-room-${socket.id}-${partnerId}`;
            socket.join(roomId);
            const pSocket = io.sockets.sockets.get(partnerId);
            if (pSocket) pSocket.join(roomId);

            textPairs.set(socket.id, { partnerId, roomId, isBot: false });
            textPairs.set(partnerId, { partnerId: socket.id, roomId, isBot: false });

            const pData = textUsers.get(partnerId);
            const myData = textUsers.get(socket.id);

            io.to(socket.id).emit("text_paired", {
                roomId,
                partnerName: pData ? pData.name : undefined,
                partnerCountry: pData ? pData.country : undefined
            });

            io.to(partnerId).emit("text_paired", {
                roomId,
                partnerName: myData ? myData.name : undefined,
                partnerCountry: myData ? myData.country : undefined
            });

        } else {
            textQueue.push(socket.id);
            const timer = setTimeout(() => startBotChat(socket.id), BOT_TIMEOUT_MS);
            userBotTimers.set(socket.id, timer);
        }
    });

    socket.on("send_1v1_message", async(data) => {
        const pair = textPairs.get(socket.id);
        if (pair) {
            if (!pair.isBot) {
                // Humano x Humano
                io.to(pair.roomId).emit("receive_1v1_message", {
                    ...data,
                    sender: socket.id === data.senderId ? "user" : "stranger"
                });
            } else {
                // Humano x Bot
                socket.emit("receive_1v1_message", {...data, sender: "user" });

                // --- [HUMANO] 2. CHANCE DE PULAR (SKIP) ---
                // 10% de chance de desconectar a cada mensagem recebida (Simula tédio)
                if (Math.random() < 0.1) {
                    setTimeout(() => {
                        socket.emit("text_partner_disconnected");
                        textPairs.delete(socket.id);
                        botConversations.delete(socket.id);
                    }, 2000 + Math.random() * 2000); // Demora 2 a 4s e sai sem responder
                    return;
                }

                // --- [HUMANO] 3. HESITAÇÃO AO DIGITAR ---
                setTimeout(async() => {
                    // Começa a "Digitar"
                    socket.emit("partner_typing");

                    // Gera o texto
                    const aiReply = await getAIResponse(socket.id, data.text);

                    // Aumentei a velocidade (50ms a 100ms) - 200ms era muito lento
                    const typingSpeed = 70;
                    const typingDuration = Math.max(800, aiReply.length * typingSpeed);

                    setTimeout(() => {
                        socket.emit("receive_1v1_message", {
                            text: aiReply,
                            sender: "stranger",
                            senderId: "bot",
                            timestamp: Date.now(),
                            id: `msg-${Date.now()}`
                        });
                        socket.emit("partner_stop_typing");
                    }, typingDuration);

                }, 800 + Math.random() * 1500);
            }
        }
    });


    socket.on("disconnect", () => {
        textUsers.delete(socket.id);
        botConversations.delete(socket.id);
        if (userBotTimers.has(socket.id)) clearTimeout(userBotTimers.get(socket.id));
        textQueue = textQueue.filter(id => id !== socket.id);

        const pair = textPairs.get(socket.id);
        if (pair) {
            if (!pair.isBot) io.to(pair.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER COM IA HUMANIZADA RODANDO NA PORTA ${PORT}`);
});