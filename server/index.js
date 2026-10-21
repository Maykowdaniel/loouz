const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// --- CONEXÃO COM O MONGODB ATLAS ---
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://louuz_user:VCerrouasenha4321$@cluster0.lajklua.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("📦 Conectado ao MongoDB Atlas com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no MongoDB:", err));

// Schema e Modelo para salvar os e-mails de notificação
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const NotificationEmail = mongoose.model("NotificationEmail", emailSchema);

// MEMÓRIA (Somente Humanos)
let textQueue = [];
const textPairs = new Map();
const textUsers = new Map();

// MEMÓRIA (Somente Humanos - Vídeo)
let videoQueue = [];
const videoPairs = new Map();

// Função para atualizar e transmitir o número real de usuários online para todos
function broadcastOnlineCount() {
    const totalOnline = io.engine.clientsCount; // Número real de sockets conectados
    io.emit("global_online_count", { count: totalOnline });
}

function getCountryByIp(socket) {
    let ip = socket.handshake.headers['x-forwarded-for'] || socket.conn.remoteAddress;
    if (ip && ip.includes('::ffff:')) ip = ip.split('::ffff:')[1];
    if (ip === '127.0.0.1' || ip === '::1') return 'BR';
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'UN';
}

io.on("connection", (socket) => {
    // Assim que alguém conecta, atualiza a contagem global
    broadcastOnlineCount();

    // Ouvinte para registrar e-mail de notificação de horário de pico permanentemente no MongoDB
    socket.on("register_notification_email", async (data) => {
        const { email } = data || {};
        if (email && email.includes("@")) {
            try {
                const existing = await NotificationEmail.findOne({ email });
                if (!existing) {
                    await NotificationEmail.create({ email });
                    console.log(`[E-mail Salvo no Banco]: ${email}`);
                } else {
                    console.log(`[E-mail Já Cadastrado]: ${email}`);
                }
                socket.emit("email_registered_success", { message: "E-mail cadastrado com sucesso!" });
            } catch (error) {
                console.error("Erro ao salvar e-mail no MongoDB:", error);
            }
        }
    });

    socket.on("join_video_queue", () => {
        videoQueue = videoQueue.filter(id => id !== socket.id);

        if (videoQueue.length > 0) {
            const partnerId = videoQueue.shift();
            videoPairs.set(socket.id, partnerId);
            videoPairs.set(partnerId, socket.id);

            io.to(partnerId).emit("start_call", { socketId: socket.id, initiator: true });
            io.to(socket.id).emit("start_call", { socketId: partnerId, initiator: false });
        } else {
            videoQueue.push(socket.id);
        }
    });

    socket.on("send_signal", (data) => {
        io.to(data.userToCall).emit("receive_signal", { signal: data.signalData });
    });

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

        textUsers.set(socket.id, {
            name,
            interests,
            country,
            gender: gender || 'm',
            lookingFor: lookingFor || 'any'
        });

        if (textPairs.has(socket.id)) {
            const old = textPairs.get(socket.id);
            io.to(old.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
            textPairs.delete(old.partnerId);
        }

        textQueue = textQueue.filter(u => u.id !== socket.id);

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

            const roomId = `text-room-${socket.id}-${partnerId}`;
            socket.join(roomId);

            const pSocket = io.sockets.sockets.get(partnerId);
            if (pSocket) pSocket.join(roomId);

            textPairs.set(socket.id, { partnerId, roomId });
            textPairs.set(partnerId, { partnerId: socket.id, roomId });

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

    socket.on("disconnect", () => {
        textUsers.delete(socket.id);
        textQueue = textQueue.filter(u => u.id !== socket.id);

        const pair = textPairs.get(socket.id);
        if (pair) {
            io.to(pair.partnerId).emit("text_partner_disconnected");
            textPairs.delete(socket.id);
            textPairs.delete(pair.partnerId);
        }

        videoQueue = videoQueue.filter(id => id !== socket.id);
        const partnerId = videoPairs.get(socket.id);
        
        if (partnerId) {
            io.to(partnerId).emit("partner_disconnected");
            videoPairs.delete(socket.id);
            videoPairs.delete(partnerId);
        }

        // Atualiza a contagem global quando alguém sai
        broadcastOnlineCount();
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER ONLY-HUMANS RODANDO NA PORTA ${PORT}`);
});