const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Store the latest post ID
let latestPostId = null;

// Telegram Bot Setup
const token = "7099569188:AAEgxVf1F6JMvILf5-g0hC1cBysDGOnM4KY";
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

// Listen for new posts in the channel
bot.on("channel_post", (msg) => {
  const postId = msg.message_id;
  const chatId = msg.chat.id;
  const text = msg.text || "No text available";

  console.log(`New post in channel ${chatId}:`);
  console.log(`Post ID: ${postId}`);
  console.log(`Content: ${text}`);

  // Update the latest post ID
  latestPostId = postId;
});

// Endpoint to get the latest post ID
app.get("/latest-post-id", (req, res) => {
  res.json({ postId: latestPostId });
});

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
