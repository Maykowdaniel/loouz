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

const activeUsers = new Map();

function getRoomCount(room) {
    const roomSet = io.sockets.adapter.rooms.get(room);
    return roomSet ? roomSet.size : 0;
}

function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];

    // Simula BR em localhost
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';

    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

io.on("connection", (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.on("join_room", (data) => {
        // AGORA RECEBEMOS O GENDER AQUI
        const { room, username, gender } = data;
        socket.join(room);

        const country = getCountryByIp(socket);

        // Salvamos o gênero na memória junto com os outros dados
        activeUsers.set(socket.id, { username, room, country, gender });

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
        // Recuperamos o gênero salvo
        const senderGender = user ? user.gender : 'unspecified';

        // Enviamos o gênero junto com a mensagem e a bandeira
        const messageWithDetails = {...data, senderCountry, senderGender };

        io.to(data.room).emit("receive_message", messageWithDetails);
    });

    socket.on("disconnect", () => {
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

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVIDOR (COM AVATARES) RODANDO NA PORTA ${PORT}`);
});