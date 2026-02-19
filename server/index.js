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
let textQueue = [];
const textPairs = new Map();
const textUsers = new Map();
const botConversations = new Map();
const userBotTimers = new Map();

// MEMÓRIA DE IDENTIDADE DO BOT
const botIdentities = new Map();

const BOT_TIMEOUT_MS = 1000;

// --- GERADOR DE IDENTIDADE VIA API ---
async function fetchBotIdentity(genderPreference) {
    try {
        const genderQuery = (genderPreference === 'm') ? 'male' : (genderPreference === 'f') ? 'female' : '';
        const url = `https://randomuser.me/api/?gender=${genderQuery}&nat=us,gb,ca,au`;

        const response = await fetch(url);
        const data = await response.json();
        const person = data.results[0];

        return {
            name: person.name.first.toLowerCase(),
            gender: person.gender,
            age: person.dob.age,
            location: person.location.state.toLowerCase()
        };

    } catch (error) {
        console.error("Erro ao buscar identidade real:", error);
        const backupGender = genderPreference === 'm' ? 'male' : 'female';
        return {
            name: backupGender === 'male' ? 'mike' : 'sarah',
            gender: backupGender,
            age: 21,
            location: 'usa'
        };
    }
}

// --- FUNÇÃO IA INTELIGENTE ---
async function getAIResponse(socketId, userMessage) {
    const userData = textUsers.get(socketId);
    let botIdentity = botIdentities.get(socketId);

    if (!botIdentity) {
        botIdentity = { name: "alex", gender: "male", age: 20, location: "usa" };
    }

    const interests = (userData && userData.interests) || "general stuff";
    let history = botConversations.get(socketId) || [];
    history.push({ role: "user", content: userMessage });

    try {
        const completion = await openai.chat.completions.create({
            model: "x-ai/grok-4.1-fast",
            messages: [{
                    role: "system",
                    content: `You are chatting on Omegle.
                    
                    YOUR FIXED IDENTITY (THIS IS REAL, DO NOT CHANGE):
                    - Name: ${botIdentity.name}
                    - Gender: ${botIdentity.gender} (If user asks 'm or f', say '${botIdentity.gender === 'male' ? 'm' : 'f'}')
                    - Age: ${botIdentity.age}
                    - Location: ${botIdentity.location}
                    
                    PERSONALITY RULES:
                    1. You are bored and lazy. 
                    2. Type in lowercase ONLY.
                    3. SHORT answers (1-8 words max).
                    4. DO NOT be overly enthusiastic. Stop saying "cool", "nice".
                    5. Be a bit dry/sarcastic. 
                    6. TYPOS ALLOWED (u, ur, idk, tho).
                    
                    Current Topic/Interests: ${interests}.`
                },
                ...history.slice(-6)
            ],
            temperature: 1.1,
            max_tokens: 60,
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
async function startBotChat(socketId) {
    const userSocket = io.sockets.sockets.get(socketId);
    if (!userSocket || textPairs.has(socketId)) return;

    textQueue = textQueue.filter(u => u.id !== socketId);
    const userData = textUsers.get(socketId);

    let targetGender = 'any';
    if (userData && userData.lookingFor === 'f') targetGender = 'f';
    else if (userData && userData.lookingFor === 'm') targetGender = 'm';
    else targetGender = Math.random() > 0.5 ? 'm' : 'f';

    const identity = await fetchBotIdentity(targetGender);

    botIdentities.set(socketId, identity);

    const displayName = `Guest${Math.floor(Math.random() * 90000)}`;
    const botId = `bot-${Date.now()}`;
    const roomId = `text-room-${socketId}-${botId}`;

    userSocket.join(roomId);
    textPairs.set(socketId, { partnerId: botId, roomId, isBot: true });
    botConversations.set(socketId, []);

    // Envia dados para o Frontend (SEM FOTO)
    io.to(socketId).emit("text_paired", {
        roomId,
        partnerName: displayName,
        partnerCountry: "US"
    });

    // Bot inicia (30% chance de mandar primeiro)
    if (Math.random() > 0.3) {
        // Delay realista
        const initialHesitation = 2500 + Math.random() * 2000;

        setTimeout(() => {
            const botG = identity.gender === 'male' ? 'm' : 'f';
            const openers = ["hi", "hey", "sup", "bored", botG, "u?"];
            const opener = openers[Math.floor(Math.random() * openers.length)];

            userSocket.emit("partner_typing");

            const history = botConversations.get(socketId) || [];
            history.push({ role: "assistant", content: opener });
            botConversations.set(socketId, history);

            const typingDuration = 800 + (opener.length * 100);

            setTimeout(() => {
                userSocket.emit("receive_1v1_message", {
                    text: opener,
                    sender: "stranger",
                    senderId: "bot",
                    timestamp: Date.now(),
                    id: `msg-${Date.now()}`
                });
                userSocket.emit("partner_stop_typing");
            }, typingDuration);

        }, initialHesitation);
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
        const { name, interests, gender, lookingFor } = userData || {};
        const country = getCountryByIp(socket);

        botIdentities.delete(socket.id);

        textUsers.set(socket.id, {
            name,
            interests,
            country,
            gender: gender || 'm',
            lookingFor: lookingFor || 'any'
        });

        if (textPairs.has(socket.id)) {
            const old = textPairs.get(socket.id);
            if (!old.isBot) io.to(old.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
        }
        if (userBotTimers.has(socket.id)) clearTimeout(userBotTimers.get(socket.id));
        textQueue = textQueue.filter(u => u.id !== socket.id);

        // MATCHMAKING
        const myGender = gender || 'm';
        const myPref = lookingFor || 'any';

        const matchIndex = textQueue.findIndex(candidate => {
            const partnerGender = candidate.gender;
            const partnerPref = candidate.lookingFor;
            const iLikePartner = (myPref === 'any') || (myPref === partnerGender);
            const partnerLikesMe = (partnerPref === 'any') || (partnerPref === myGender);
            return iLikePartner && partnerLikesMe;
        });

        if (matchIndex !== -1) {
            const partnerEntry = textQueue.splice(matchIndex, 1)[0];
            const partnerId = partnerEntry.id;
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
            textQueue.push({ id: socket.id, gender: myGender, lookingFor: myPref });
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

                if (Math.random() < 0.10) { // Chance de sair
                    setTimeout(() => {
                        socket.emit("text_partner_disconnected");
                        textPairs.delete(socket.id);
                        botConversations.delete(socket.id);
                        botIdentities.delete(socket.id);
                    }, 3000 + Math.random() * 2000);
                    return;
                }

                // Lógica de Delay de Leitura
                const msgLength = data.text.length;
                const readDelay = 1900 + (msgLength * 35) + (Math.random() * 1000);

                setTimeout(async() => {
                    socket.emit("partner_typing");
                    const aiReply = await getAIResponse(socket.id, data.text);
                    const typingSpeed = 100;
                    const typingDuration = Math.max(600, aiReply.length * typingSpeed);

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

                }, readDelay);
            }
        }
    });

    socket.on("disconnect", () => {
        textUsers.delete(socket.id);
        botConversations.delete(socket.id);
        botIdentities.delete(socket.id);

        if (userBotTimers.has(socket.id)) clearTimeout(userBotTimers.get(socket.id));
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
    console.log(`SERVER SEM FOTO NO CHAT TEXTO RODANDO NA PORTA ${PORT}`);
});