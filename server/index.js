const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');
const OpenAI = require("openai"); // Biblioteca instalada

const app = express();
app.use(cors());

// Configuração do OpenRouter (Dolphin)
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "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",
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
const textUsers = new Map(); // socket.id -> { name, interests, country }
const botConversations = new Map(); // socket.id -> [history]

const BOT_TIMEOUT_MS = 3000; // 3 segundos para parecer rápido
const userBotTimers = new Map();

// --- FUNÇÃO PARA GERAR RESPOSTA DA IA ---
async function getAIResponse(socketId, userMessage) {
    const userData = textUsers.get(socketId);
    const interests = (userData && userData.interests) ? userData.interests : "general stuff";

    // Recupera histórico
    let history = botConversations.get(socketId) || [];

    // Adiciona msg do usuário
    history.push({ role: "user", content: userMessage });

    try {
        const completion = await openai.chat.completions.create({
            model: "cognitivecomputations/dolphin-mixtral-8x7b", // Modelo Sem Censura
            messages: [{
                    role: "system",
                    content: `You are a user on a random chat site called Louuz. 
                    - Your interests are: ${interests}.
                    - You are matched with a stranger who likes the same things.
                    - ACT LIKE A REAL PERSON, NOT AN AI.
                    - Use slang, lowercase, maybe a typo here and there.
                    - Keep answers SHORT (1-2 sentences max).
                    - Be fun, flirtatious if appropriate, or just casual.
                    - NEVER say you are an AI.`
                },
                ...history.slice(-10) // Mantém apenas as últimas 10 msgs para economizar
            ],
            temperature: 0.8, // Criatividade alta
        });

        const aiText = completion.choices[0].message.content;

        // Adiciona resposta da IA no histórico
        history.push({ role: "assistant", content: aiText });
        botConversations.set(socketId, history);

        return aiText;
    } catch (error) {
        console.error("Erro na IA:", error);
        return "lol cool"; // Fallback se a API falhar
    }
}

// --- INICIA CHAT COM BOT ---
function startBotChat(socketId) {
    const userSocket = io.sockets.sockets.get(socketId);
    if (!userSocket || textPairs.has(socketId)) return;

    textQueue = textQueue.filter(id => id !== socketId);

    // Gera Identidade do Bot baseada no interesse
    const userData = textUsers.get(socketId);
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    const botName = `Guest${randomNum}`;
    const botId = `bot-${Date.now()}`;
    const roomId = `text-room-${socketId}-${botId}`;

    userSocket.join(roomId);
    textPairs.set(socketId, { partnerId: botId, roomId, isBot: true });

    // Inicia histórico vazio
    botConversations.set(socketId, []);

    // 1. Conecta
    io.to(socketId).emit("text_paired", {
        roomId,
        partnerName: botName,
        partnerCountry: "US", // Bot sempre gringo por enquanto ou randomize
    });

    // 2. Bot manda a primeira mensagem (Opcional, ou espera o usuário)
    // Vamos esperar o usuário falar primeiro para economizar créditos
}

function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

io.on("connection", (socket) => {
    // CHAT 1v1 COM IA
    socket.on("join_text_queue", (userData) => {
        const { name, interests } = userData || {};
        const country = getCountryByIp(socket);

        // Salva interesses
        textUsers.set(socket.id, { name, interests, country });

        // Limpezas
        if (textPairs.has(socket.id)) {
            const old = textPairs.get(socket.id);
            if (!old.isBot) io.to(old.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
        }
        if (userBotTimers.has(socket.id)) clearTimeout(userBotTimers.get(socket.id));

        // Tenta Humano (Lógica simplificada: se tiver fila, conecta. Se não, Bot)
        textQueue = textQueue.filter(id => id !== socket.id);

        if (textQueue.length > 0) {
            // MATCH HUMANO (Raro no início)
            const partnerId = textQueue.shift();

            // Remove o timer do bot do parceiro se existir
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

            // CORREÇÃO AQUI: Usando ternário simples em vez de ?.
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
            // SEM HUMANO -> BOT EM 3 SEGUNDOS
            textQueue.push(socket.id);
            const timer = setTimeout(() => startBotChat(socket.id), BOT_TIMEOUT_MS);
            userBotTimers.set(socket.id, timer);
        }
    });

    socket.on("send_1v1_message", async(data) => {
        const pair = textPairs.get(socket.id);
        if (pair) {
            if (!pair.isBot) {
                // Humano para Humano
                io.to(pair.roomId).emit("receive_1v1_message", {
                    ...data,
                    sender: socket.id === data.senderId ? "user" : "stranger"
                });
            } else {
                // Humano para IA
                // 1. Mostra a msg do usuário
                socket.emit("receive_1v1_message", {...data, sender: "user" });

                // 2. Simula "Stranger is typing..." (Opcional)
                // 3. Gera resposta da IA
                // Delay artificial para parecer humano digitando
                setTimeout(async() => {
                    const aiReply = await getAIResponse(socket.id, data.text);
                    socket.emit("receive_1v1_message", {
                        text: aiReply,
                        sender: "stranger",
                        senderId: "bot",
                        timestamp: Date.now(),
                        id: `msg-${Date.now()}`
                    });
                }, 1500 + Math.random() * 2000); // 1.5s a 3.5s de delay
            }
        }
    });

    socket.on("disconnect", () => {
        textUsers.delete(socket.id);
        botConversations.delete(socket.id); // Limpa memória da IA
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