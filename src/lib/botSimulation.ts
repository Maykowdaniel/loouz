/**
 * Bot simulation responses for the chat MVP.
 * In the future, this will be replaced by real WebSocket/Socket.IO communication.
 */

const BOT_RESPONSES = [
  "Hey! Where are you from? 🌍",
  "Nice to meet you! What do you do?",
  "Haha that's cool 😄",
  "Have you ever been to Brazil?",
  "What kind of music do you listen to?",
  "I love meeting new people here!",
  "Tell me something interesting about yourself",
  "That's awesome! 🔥",
  "I'm from somewhere far away 😎",
  "What's your favorite movie?",
  "Do you like video games?",
  "The weather is crazy here today 🌧️",
  "What are your hobbies?",
  "That's funny 😂",
  "I agree with you!",
  "Really? That's so cool!",
  "I've never heard that before, interesting!",
  "You seem like a nice person 😊",
  "What time is it where you are?",
  "This is fun! I love chatting with strangers",
];

let lastIndex = -1;

/**
 * Returns a random bot response, avoiding repeating the last one.
 */
export function getRandomBotResponse(): string {
  let index: number;
  do {
    index = Math.floor(Math.random() * BOT_RESPONSES.length);
  } while (index === lastIndex && BOT_RESPONSES.length > 1);
  lastIndex = index;
  return BOT_RESPONSES[index];
}

/**
 * Returns a random delay in ms between min and max (simulates human typing).
 */
export function getRandomDelay(min = 1000, max = 3000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
