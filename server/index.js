const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const geoip = require("geoip-lite");
const OpenAI = require("openai");

const app = express();
app.use(cors());

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

// ================== MEMÓRIA ==================

let textQueue = [];
const textPairs = new Map();
const textUsers = new Map();
const botConversations = new Map();
const userBotTimers = new Map();
const botIdentities = new Map();
const botStates = new Map();

const BOT_TIMEOUT_MS = 1000;


// ================== IDENTIDADE ==================

async function fetchBotIdentity(genderPreference) {
    try {
        const genderQuery =
            genderPreference === "m" ?
            "male" :
            genderPreference === "f" ?
            "female" :
            "";

        const response = await fetch(
            `https://randomuser.me/api/?gender=${genderQuery}&nat=us,gb,ca,au`
        );
        const data = await response.json();
        const person = data.results[0];

        return {
            name: person.name.first.toLowerCase(),
            gender: person.gender,
            age: person.dob.age,
            location: person.location.state.toLowerCase(),
        };
    } catch (err) {
        return {
            name: "alex",
            gender: "male",
            age: 21,
            location: "usa",
        };
    }
}


// ================== OPENER IA ==================

async function generateBotOpener(socketId) {
    const userData = textUsers.get(socketId);
    const botIdentity = botIdentities.get(socketId);

    if (!botIdentity) return "hey";

    const interests =
        userData && userData.interests ?
        userData.interests :
        "random stuff";


    try {
        const completion = await openai.chat.completions.create({
            model: "x-ai/grok-4.1-fast",
            messages: [{
                role: "system",
                content: `
You are starting a chat on Omegle.

Identity:
${botIdentity.name}, ${botIdentity.age}, ${botIdentity.gender}, ${botIdentity.location}

Rules:
- lowercase only
- 1-6 words
- dry personality
- no emojis

User interests: ${interests}

Generate first message only.
`
            }],
            temperature: 1.2,
            max_tokens: 20
        });

        return completion.choices[0].message.content
            .replace(/"/g, "")
            .toLowerCase()
            .trim();

    } catch {
        return "hey";
    }
}


// ================== IA RESPOSTA ==================

async function getAIResponse(socketId, userMessage) {
    const botIdentity = botIdentities.get(socketId);
    const state = botStates.get(socketId);

    let history = botConversations.get(socketId) || [];
    history.push({ role: "user", content: userMessage });

    const moodLabel =
        state.mood < 0.3 ? "slightly annoyed" :
        state.mood < 0.7 ? "neutral" :
        "playfully interested";

    const interestLabel =
        state.interest < 0.3 ? "low interest" :
        state.interest < 0.7 ? "medium interest" :
        "high interest";

    try {
        const completion = await openai.chat.completions.create({
            model: "x-ai/grok-4.1-fast",
            messages: [{
                    role: "system",
                    content: `
You are chatting on Omegle.

Identity:
${botIdentity.name}, ${botIdentity.age}, ${botIdentity.gender}, ${botIdentity.location}

Psychological State:
- Mood: ${moodLabel}
- Interest: ${interestLabel}
- Patience: ${state.patience.toFixed(2)}

Rules:
- lowercase only
- 1-8 words
- dry tone
- no emojis
`
                },
                ...history.slice(-6)
            ],
            temperature: 1.1,
            max_tokens: 60
        });

        let aiText = completion.choices[0].message.content
            .replace(/"/g, "")
            .toLowerCase();

        history.push({ role: "assistant", content: aiText });
        botConversations.set(socketId, history);

        return aiText;

    } catch {
        return "lol lag";
    }
}


// ================== START BOT ==================

async function startBotChat(socketId) {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket || textPairs.has(socketId)) return;

    const userData = textUsers.get(socketId);

    const targetGender =
        userData && userData.lookingFor === "f" ?
        "f" :
        userData && userData.lookingFor === "m" ?
        "m" :
        Math.random() > 0.5 ?
        "m" :
        "f";


    const identity = await fetchBotIdentity(targetGender);
    botIdentities.set(socketId, identity);

    botStates.set(socketId, {
        mood: Math.random(),
        interest: 0.5,
        energy: Math.random(),
        patience: 1.0,
        messagesExchanged: 0
    });

    const roomId = `room-${socketId}-${Date.now()}`;
    textPairs.set(socketId, { partnerId: "bot", roomId, isBot: true });
    botConversations.set(socketId, []);

    socket.emit("text_paired", {
        roomId,
        partnerName: `Guest${Math.floor(Math.random()*90000)}`,
        partnerCountry: "US"
    });

    if (Math.random() > 0.2) {
        const delay = 2000 + Math.random() * 2000;

        setTimeout(async() => {
            socket.emit("partner_typing");

            const opener = await generateBotOpener(socketId);
            const state = botStates.get(socketId);

            const speed =
                state.energy < 0.4 ? 160 :
                state.energy < 0.8 ? 110 :
                70;

            const typingDuration = Math.max(600, opener.length * speed);

            setTimeout(() => {
                socket.emit("receive_1v1_message", {
                    text: opener,
                    sender: "stranger",
                    senderId: "bot",
                    timestamp: Date.now(),
                    id: `msg-${Date.now()}`
                });
                socket.emit("partner_stop_typing");
            }, typingDuration);

        }, delay);
    }
}


// ================== SOCKET ==================

io.on("connection", (socket) => {

    socket.on("join_text_queue", (userData) => {
        textUsers.set(socket.id, userData || {});
        setTimeout(() => startBotChat(socket.id), BOT_TIMEOUT_MS);
    });

    socket.on("send_1v1_message", async(data) => {
        const pair = textPairs.get(socket.id);
        if (!pair || !pair.isBot) return;

        const state = botStates.get(socket.id);
        state.messagesExchanged++;

        // Atualiza interesse
        if (data.text.length > 40) state.interest += 0.05;
        if (data.text.includes("?")) state.interest += 0.03;
        if (data.text.length < 3) state.interest -= 0.05;

        state.interest = Math.max(0, Math.min(1, state.interest));
        state.patience -= 0.03;
        state.patience = Math.max(0, state.patience);

        state.mood += (Math.random() - 0.5) * 0.1;
        state.mood = Math.max(0, Math.min(1, state.mood));

        botStates.set(socket.id, state);

        // Ghosting inteligente
        const ghostProbability =
            (1 - state.interest) * 0.2 +
            (1 - state.patience) * 0.3;

        if (Math.random() < ghostProbability) {
            setTimeout(() => {
                socket.emit("text_partner_disconnected");
                textPairs.delete(socket.id);
                botStates.delete(socket.id);
            }, 2000 + Math.random() * 2000);
            return;
        }

        socket.emit("receive_1v1_message", {...data, sender: "user" });

        const readDelay = 1800 + data.text.length * 40;

        setTimeout(async() => {

            socket.emit("partner_typing");

            const aiReply = await getAIResponse(socket.id, data.text);

            const speed =
                state.energy < 0.4 ? 160 :
                state.energy < 0.8 ? 110 :
                70;

            const typingDuration = Math.max(600, aiReply.length * speed);

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
    });

    socket.on("disconnect", () => {
        textPairs.delete(socket.id);
        botStates.delete(socket.id);
        botIdentities.delete(socket.id);
        botConversations.delete(socket.id);
    });
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log("SERVER COM BOT COMPORTAMENTAL ATIVO NA PORTA", PORT);
});