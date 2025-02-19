const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");
const { config } = require("dotenv");

config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Store the latest post ID
let latestPostId = null;
let channelImageLink = null;
let channelName = null;

// Telegram Bot Setup
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

// Listen for new posts in the channel
bot.on("channel_post", async (msg) => {
  const postId = msg.message_id;
  const chatId = msg.chat.id;
  const text = msg.text || "No text available";

  console.log(`New post in channel ${chatId}:`);
  console.log(`Post ID: ${postId}`);
  console.log(`Content: ${text}`);

  // Updates the latest post ID
  latestPostId = postId;

  try {
    // Fetchs channel details
    const chatInfo = await bot.getChat(chatId);

    // Extract channel name
    channelName = chatInfo.title;
    console.log(`Channel Name: ${channelName}`);

    // Extracts channel profile picture (if available)
    if (chatInfo.photo) {
      const photo = chatInfo.photo;
      const largestPhoto = photo.big_file_id;

      // Gets the file URL using the file ID
      const fileLink = await bot.getFileLink(largestPhoto);
      channelImageLink = fileLink;
      console.log(`Channel Profile Picture: ${fileLink}`);
    } else {
      console.log("Channel does not have a profile picture.");
    }
  } catch (error) {
    console.error("Failed to fetch channel details:", error);
  }
});

// Endpoint to get the latest post ID
app.get("/latest-post-id", (req, res) => {
  res.json({ postId: latestPostId, channelImageLink, channelName });
});

// Serves the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
