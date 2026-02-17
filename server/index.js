const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');
const OpenAI = require("openai");

const app = express();
app.use(cors());

// --- CONFIGURAÇÃO OPENROUTER CORRIGIDA ---
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "SUA_CHAVE_AQUI_SE_FOR_TESTE_LOCAL",
    // ADICIONE ISTO: OpenRouter exige estes cabeçalhos para não bloquear
    defaultHeaders: {
        "HTTP-Referer": "https://louuz.com", // Coloque seu site (mesmo que não exista ainda)
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

const BOT_TIMEOUT_MS = 3000;
const userBotTimers = new Map();

// --- FUNÇÃO PARA GERAR RESPOSTA DA IA ---
async function getAIResponse(socketId, userMessage) {
    const userData = textUsers.get(socketId);
    // Correção do operador lógico
    const interests = (userData && userData.interests) ? userData.interests : "general stuff";

    let history = botConversations.get(socketId) || [];
    history.push({ role: "user", content: userMessage });

    try {
        console.log("Enviando para IA..."); // Log para depuração

        const completion = await openai.chat.completions.create({
            // Trocamos para o Mythomax (Rei do Roleplay Sem Censura) para garantir estabilidade
            model: "gryphe/mythomax-l2-13b:free",
            messages: [{
                    role: "system",
                    content: `You are a user on a random chat site called Louuz. 
                    - Your interests are: ${interests}.
                    - ACT LIKE A REAL PERSON, NOT AN AI.
                    - Use slang, lowercase, typos.
                    - Keep answers SHORT (max 10 words).
                    - Be fun and casual.`
                },
                ...history.slice(-6) // Mantém apenas as últimas 6 msgs para ser rápido
            ],
            temperature: 0.8,
        });

        const aiText = completion.choices[0].message.content;

        console.log("Resposta da IA:", aiText); // Veja a resposta no terminal

        history.push({ role: "assistant", content: aiText });
        botConversations.set(socketId, history);

        return aiText;

    } catch (error) {
        // --- LOG DE ERRO DETALHADO ---
        // Olhe no seu TERMINAL quando der erro, ele vai dizer o motivo exato
        if (error.response) {
            console.error("Erro API OpenRouter:", error.response.status, error.response.data);
        } else {
            console.error("Erro na conexão IA:", error.message);
        }
        return "lol cool"; // Fallback
    }
}

// ... (RESTO DO CÓDIGO IGUAL - startBotChat, io.on connection, etc.) ...
// Mantenha o restante do seu código abaixo exatamente como estava.
// Vou repetir apenas as funções essenciais para garantir que nada quebre.

function startBotChat(socketId) {
    const userSocket = io.sockets.sockets.get(socketId);
    if (!userSocket || textPairs.has(socketId)) return;

    textQueue = textQueue.filter(id => id !== socketId);

    const userData = textUsers.get(socketId);
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
}

function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

io.on("connection", (socket) => {
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
                partnerName: pData ? pData.name : "Stranger",
                partnerCountry: pData ? pData.country : "UN"
            });
            io.to(partnerId).emit("text_paired", {
                roomId,
                partnerName: myData ? myData.name : "Stranger",
                partnerCountry: myData ? myData.country : "UN"
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
                io.to(pair.roomId).emit("receive_1v1_message", {
                    ...data,
                    sender: socket.id === data.senderId ? "user" : "stranger"
                });
            } else {
                socket.emit("receive_1v1_message", {...data, sender: "user" });

                // Diminuí o delay para 1s para testar mais rápido
                setTimeout(async() => {
                    const aiReply = await getAIResponse(socket.id, data.text);
                    socket.emit("receive_1v1_message", {
                        text: aiReply,
                        sender: "stranger",
                        senderId: "bot",
                        timestamp: Date.now(),
                        id: `msg-${Date.now()}`
                    });
                }, 1000 + Math.random() * 1000);
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
    console.log(`SERVER COM IA RODANDO NA PORTA ${PORT}`);
});