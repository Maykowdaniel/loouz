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
    // TIPO A: O "Clássico Omegle" (Curto e Grosso)
    {
        type: 'classic',
        country: 'US',
        name: 'Stranger',
        gender: 'male',
        messages: [
            { text: "m", delay: 3500 },
            { text: "u?", delay: 5000 },
            { text: "from?", delay: 5600 }
            // Fim do script -> Bot desconecta
        ]
    },
    // TIPO B: O "Curioso Rápido" (Amigável)
    {
        type: 'friendly',
        country: 'GB',
        name: 'Stranger',
        gender: 'female',
        messages: [
            { text: "hi", delay: 2000 },
            { text: "wanna chat?", delay: 5500 },
            { text: "cool", delay: 8000 }
        ]
    },
    // TIPO C: O "Insta Skipper" (O que pula - Realismo Puro)
    {
        type: 'skipper',
        country: 'BR',
        name: 'Stranger',
        gender: 'male',
        messages: [
            { text: "oi", delay: 4000 },
            // Desconecta logo depois
        ]
    },
    // TIPO D: O "Indiano" (Comum em chats)
    {
        type: 'common',
        country: 'IN',
        name: 'Stranger',
        gender: 'male',
        messages: [
            { text: "hello", delay: 4200 },
            { text: "where form?", delay: 5000 }, // Erro proposital
            { text: "bobs and vegana", delay: 9000 } // Meme clássico (opcional, gera risada)
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