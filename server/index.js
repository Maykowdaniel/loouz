const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');
const OpenAI = require("openai");

const app = express();
app.use(cors());

// --- CONFIGURAÇÃO OPENROUTER (GROK) ---
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "https://louuz.com",
        "X-Title": "Louuz Chat",
    },
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// MEMÓRIA
let textQueue = []; // Agora armazena objetos { id, gender, lookingFor }
const textPairs = new Map();
const textUsers = new Map();
const botConversations = new Map();
const userBotTimers = new Map();

const BOT_TIMEOUT_MS = 3000;

// --- FUNÇÃO IA INTELIGENTE (ADAPTA GÊNERO) ---
async function getAIResponse(socketId, userMessage) {
    const userData = textUsers.get(socketId);

    // Se o usuário procurava Mulher ('f'), a IA finge ser mulher. Se procurava Homem ('m'), finge ser homem.
    const userLookingFor = (userData && userData.lookingFor) || 'any';
    let aiGender = 'any';

    if (userLookingFor === 'f') aiGender = 'female';
    else if (userLookingFor === 'm') aiGender = 'male';
    else aiGender = Math.random() > 0.5 ? 'male' : 'female'; // Aleatório se user não liga

    const interests = (userData && userData.interests) || "general stuff";
    let history = botConversations.get(socketId) || [];
    history.push({ role: "user", content: userMessage });

    try {
        const completion = await openai.chat.completions.create({
            model: "x-ai/grok-4.1-fast", // Ou o modelo que você preferir
            messages: [{
                    role: "system",
                    content: `You are a user on a chat site like Omegle.
                    
                    YOUR IDENTITY:
                    - You are a ${aiGender}. (This is important for context).
                    - You are bored, lazy, typing fast (lowercase).
                    - You are NOT an AI. You are a real person.
                    
                    RULES:
                    1. Short answers (max 10 words).
                    2. Use slang (lol, idk, u).
                    3. No emojis.
                    4. If asked 'm or f', reply '${aiGender === 'male' ? 'm' : 'f'}'.
                    
                    Interests: ${interests}.`
                },
                ...history.slice(-6)
            ],
            temperature: 1.0,
            max_tokens: 50,
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

// Inicia Bot se não achar humano
function startBotChat(socketId) {
    const userSocket = io.sockets.sockets.get(socketId);
    if (!userSocket || textPairs.has(socketId)) return;

    // Remove da fila
    textQueue = textQueue.filter(u => u.id !== socketId);

    const userData = textUsers.get(socketId);

    // Define o Bot baseado no que o usuário procura
    let botGender = 'm';
    if (userData && userData.lookingFor === 'f') {
        botGender = 'f';
    } else if (userData && userData.lookingFor === 'm') {
        botGender = 'm';
    } else botGender = Math.random() > 0.5 ? 'm' : 'f';

    // Foto fake baseada no gênero do bot
    const botAvatar = `https://randomuser.me/api/portraits/${botGender === 'm' ? 'men' : 'women'}/${Math.floor(Math.random()*99)}.jpg`;

    const botName = `Guest${Math.floor(Math.random() * 90000)}`;
    const botId = `bot-${Date.now()}`;
    const roomId = `text-room-${socketId}-${botId}`;

    userSocket.join(roomId);
    textPairs.set(socketId, { partnerId: botId, roomId, isBot: true });
    botConversations.set(socketId, []);

    io.to(socketId).emit("text_paired", {
        roomId,
        partnerName: botName,
        partnerCountry: "US",
        partnerAvatar: botAvatar // Manda a foto
    });

    // Bot inicia conversa (50% chance)
    if (Math.random() > 0.5) {
        setTimeout(() => {
            const openers = ["hi", "hey", "sup", "yo", botGender === 'm' ? 'm' : 'f', "u?"];
            const opener = openers[Math.floor(Math.random() * openers.length)];
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
                const history = botConversations.get(socketId) || [];
                history.push({ role: "assistant", content: opener });
                botConversations.set(socketId, history);
            }, 1000 + (opener.length * 100));
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
        if (pair && !pair.isBot) io.to(pair.partnerId).emit("partner_typing");
    });

    socket.on("stop_typing", () => {
        const pair = textPairs.get(socket.id);
        if (pair && !pair.isBot) io.to(pair.partnerId).emit("partner_stop_typing");
    });

    socket.on("join_text_queue", (userData) => {
        const { name, interests, gender, lookingFor, avatar } = userData || {};
        const country = getCountryByIp(socket);

        // Salva dados do usuário
        textUsers.set(socket.id, {
            name,
            interests,
            country,
            gender: gender || 'm',
            lookingFor: lookingFor || 'any',
            avatar // Salva a foto que veio do front
        });

        // Limpa estado anterior se houver
        if (textPairs.has(socket.id)) {
            const old = textPairs.get(socket.id);
            if (!old.isBot) io.to(old.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
        }
        if (userBotTimers.has(socket.id)) clearTimeout(userBotTimers.get(socket.id));
        textQueue = textQueue.filter(u => u.id !== socket.id);

        // --- LÓGICA DE MATCHMAKING INTELIGENTE ---
        // Procura alguém na fila que combine comigo
        const myGender = gender || 'm';
        const myPref = lookingFor || 'any';

        const matchIndex = textQueue.findIndex(candidate => {
            const partnerGender = candidate.gender;
            const partnerPref = candidate.lookingFor;

            // Eu aceito o parceiro? (Se quero 'any', ou se o gênero dele bate com o que quero)
            const iLikePartner = (myPref === 'any') || (myPref === partnerGender);

            // O parceiro me aceita? (Se ele quer 'any', ou se meu gênero bate com o que ele quer)
            const partnerLikesMe = (partnerPref === 'any') || (partnerPref === myGender);

            return iLikePartner && partnerLikesMe;
        });

        if (matchIndex !== -1) {
            // ACHOU PARCEIRO COMPATÍVEL!
            const partnerEntry = textQueue.splice(matchIndex, 1)[0]; // Remove da fila
            const partnerId = partnerEntry.id;

            // Limpa timer do parceiro (ele não precisa mais de bot)
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

            // Manda dados cruzados (incluindo foto)
            io.to(socket.id).emit("text_paired", {
                roomId,
                partnerName: pData ? pData.name : undefined,
                partnerCountry: pData ? pData.country : undefined,
                partnerAvatar: pData ? pData.avatar : undefined
            });

            io.to(partnerId).emit("text_paired", {
                roomId,
                partnerName: myData ? myData.name : undefined,
                partnerCountry: myData ? myData.country : undefined,
                partnerAvatar: myData ? myData.avatar : undefined
            });


        } else {
            // NINGUÉM COMPATÍVEL NA FILA
            // Entra na fila e espera
            textQueue.push({
                id: socket.id,
                gender: myGender,
                lookingFor: myPref
            });

            // Inicia timer do Bot
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

                // Chance de Pular (10%)
                if (Math.random() < 0.1) {
                    setTimeout(() => {
                        socket.emit("text_partner_disconnected");
                        textPairs.delete(socket.id);
                        botConversations.delete(socket.id);
                    }, 2000 + Math.random() * 2000);
                    return;
                }

                // Hesitação + IA
                setTimeout(async() => {
                    socket.emit("partner_typing");
                    const aiReply = await getAIResponse(socket.id, data.text);
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

        // Remove da fila (precisa filtrar por ID agora, já que textQueue guarda objetos)
        textQueue = textQueue.filter(u => u.id !== socket.id);

        const pair = textPairs.get(socket.id);
        if (pair) {
            if (!pair.isBot) io.to(pair.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER COM MATCHMAKING + UPLOAD RODANDO NA PORTA ${PORT}`);
});