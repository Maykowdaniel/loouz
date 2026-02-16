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
const activeUsers = new Map(); // Para salas de grupo (Quartos)

// Memória de Vídeo
let videoQueue = [];
const videoPairs = new Map();

// Memória de Texto 1v1
let textQueue = [];
const textPairs = new Map();
const textUsers = new Map(); // Guarda nome/país

function getRoomCount(room) {
    const roomSet = io.sockets.adapter.rooms.get(room);
    return roomSet ? roomSet.size : 0;
}

function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';

    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

io.on("connection", (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    // --- 1. CHAT DE SALAS (QUARTOS/GRUPO) ---
    // --- 1. CHAT DE SALAS (QUARTOS/GRUPO) ---
    socket.on("join_room", (data) => {
        // Agora pegamos o 'country' que vem dos dados enviados (como os bots fazem)
        const { room, username, gender, country } = data;
        socket.join(room);

        // Se o país não vier no 'data' (usuário real), tentamos pelo IP
        const finalCountry = country || getCountryByIp(socket);

        videoQueue = videoQueue.filter(id => id !== socket.id);
        textQueue = textQueue.filter(id => id !== socket.id);

        // Salvamos o 'finalCountry' na memória do usuário
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

    // --- 2. LÓGICA DO VÍDEO 1v1 ---
    socket.on("join_video_queue", () => {
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

    // --- 3. LÓGICA DO CHAT DE TEXTO 1V1 ---
    socket.on("join_text_queue", (userData) => {
        // Agora aceita o país vindo do userData
        const { name, gender, country } = userData || { name: "Estranho", gender: "unspecified" };

        // Se não houver país definido, usa o IP
        const finalCountry = country || getCountryByIp(socket);

        textUsers.set(socket.id, { name, gender, country: finalCountry });
        const oldPair = textPairs.get(socket.id);
        if (oldPair) {
            io.to(oldPair.partnerId).emit("text_partner_disconnected");
            textPairs.delete(oldPair.partnerId);
            textPairs.delete(socket.id);
        }

        textQueue = textQueue.filter(id => id !== socket.id);

        if (textQueue.length > 0) {
            const partnerId = textQueue.shift();

            if (partnerId === socket.id) {
                textQueue.push(socket.id);
                return;
            }

            const roomId = `text-room-${socket.id}-${partnerId}`;

            socket.join(roomId);

            const partnerSocket = io.sockets.sockets.get(partnerId);
            if (partnerSocket) {
                partnerSocket.join(roomId);
            }

            textPairs.set(socket.id, { partnerId, roomId });
            textPairs.set(partnerId, { partnerId: socket.id, roomId });

            const myData = textUsers.get(socket.id);
            const partnerData = textUsers.get(partnerId);

            // --- AQUI ESTAVA O ERRO, MUDEI A LÓGICA PARA NÃO USAR ?. ---

            // Envia para MIM
            io.to(socket.id).emit("text_paired", {
                roomId,
                partnerName: (partnerData && partnerData.name) ? partnerData.name : "Estranho",
                partnerCountry: (partnerData && partnerData.country) ? partnerData.country : "UN"
            });

            // Envia para ELE
            io.to(partnerId).emit("text_paired", {
                roomId,
                partnerName: (myData && myData.name) ? myData.name : "Estranho",
                partnerCountry: (myData && myData.country) ? myData.country : "UN"
            });

        } else {
            textQueue.push(socket.id);
        }
    });

    socket.on("send_1v1_message", (data) => {
        const pair = textPairs.get(socket.id);
        if (pair) {
            io.to(pair.roomId).emit("receive_1v1_message", {
                ...data,
                sender: socket.id === data.senderId ? "user" : "stranger"
            });
        }
    });

    // --- 4. DESCONEXÃO GERAL ---
    socket.on("disconnect", () => {
        textUsers.delete(socket.id);

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
            io.to(txtPair.partnerId).emit("text_partner_disconnected");
            textPairs.delete(txtPair.partnerId);
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
            setTimeout(() => {
                const count = getRoomCount(user.room);
                io.to(user.room).emit("room_meta", { count });
            }, 100);
        }
    });
});

const PORT = process.env.PORT || 3001; // <--- O Render vai preencher essa variável automaticamente
server.listen(PORT, () => {
    console.log(`SERVIDOR ARRUAMADO RODANDO NA PORTA ${PORT}`);
});