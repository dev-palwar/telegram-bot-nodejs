const TelegramBot = require("node-telegram-bot-api");

const token = "7099569188:AAEgxVf1F6JMvILf5-g0hC1cBysDGOnM4KY";

// Creates a bot instance
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

// Listens for new messages in the channel
bot.on("channel_post", (msg) => {
  const postId = msg.message_id;
  const chatId = msg.chat.id;
  const text = msg.text || "No text available";
  const usrname = msg;

  console.log(`New post in channel ${chatId}:`);
  console.log(`Post ID: ${postId}`);
  console.log(`Content: ${text}`);
  console.log(`Channel Username: ${JSON.stringify(usrname)}`);
});

// Handles errors
bot.on("polling_error", (error) => {
  console.error(`Polling error: ${error}`);
});
