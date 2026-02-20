const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// MEMÓRIA (Somente Humanos)
let textQueue = [];
const textPairs = new Map();
const textUsers = new Map();

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
        if (pair) io.to(pair.partnerId).emit("partner_typing");
    });

    socket.on("stop_typing", () => {
        const pair = textPairs.get(socket.id);
        if (pair) io.to(pair.partnerId).emit("partner_stop_typing");
    });

    socket.on("join_text_queue", (userData) => {
        const { name, interests, gender, lookingFor } = userData || {};
        const country = getCountryByIp(socket);

        // Registra o usuário
        textUsers.set(socket.id, {
            name,
            interests,
            country,
            gender: gender || 'm',
            lookingFor: lookingFor || 'any'
        });

        // Se o usuário pulou a conversa, avisa o antigo parceiro e limpa os registros
        if (textPairs.has(socket.id)) {
            const old = textPairs.get(socket.id);
            io.to(old.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
            textPairs.delete(old.partnerId);
        }

        // Remove de filas antigas
        textQueue = textQueue.filter(u => u.id !== socket.id);

        const myGender = gender || 'm';
        const myPref = lookingFor || 'any';

        // Procura um match humano compatível
        const matchIndex = textQueue.findIndex(candidate => {
            const partnerGender = candidate.gender;
            const partnerPref = candidate.lookingFor;
            const iLikePartner = (myPref === 'any') || (myPref === partnerGender);
            const partnerLikesMe = (partnerPref === 'any') || (partnerPref === myGender);
            return iLikePartner && partnerLikesMe;
        });

        if (matchIndex !== -1) {
            // Match encontrado! Remove o parceiro da fila
            const partnerEntry = textQueue.splice(matchIndex, 1)[0];
            const partnerId = partnerEntry.id;

            const roomId = `text-room-${socket.id}-${partnerId}`;
            socket.join(roomId);

            const pSocket = io.sockets.sockets.get(partnerId);
            if (pSocket) pSocket.join(roomId);

            // Registra o par para ambos
            textPairs.set(socket.id, { partnerId, roomId });
            textPairs.set(partnerId, { partnerId: socket.id, roomId });

            const pData = textUsers.get(partnerId);
            const myData = textUsers.get(socket.id);

            // Avisa o cliente atual
            io.to(socket.id).emit("text_paired", {
                roomId,
                partnerName: pData ? pData.name : undefined,
                partnerCountry: pData ? pData.country : undefined
            });

            // Avisa o parceiro
            io.to(partnerId).emit("text_paired", {
                roomId,
                partnerName: myData ? myData.name : undefined,
                partnerCountry: myData ? myData.country : undefined
            });
        } else {
            // Sem match no momento, entra na fila
            textQueue.push({ id: socket.id, gender: myGender, lookingFor: myPref });
        }
    });

    socket.on("send_1v1_message", (data) => {
        const pair = textPairs.get(socket.id);
        if (pair) {
            // Envia a mensagem para a sala (ambos recebem)
            io.to(pair.roomId).emit("receive_1v1_message", {
                ...data,
                sender: socket.id === data.senderId ? "user" : "stranger"
            });
        }
    });

    socket.on("disconnect", () => {
        textUsers.delete(socket.id);
        textQueue = textQueue.filter(u => u.id !== socket.id);

        const pair = textPairs.get(socket.id);
        if (pair) {
            io.to(pair.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
            textPairs.delete(pair.partnerId);
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER ONLY-HUMANS RODANDO NA PORTA ${PORT}`);
});