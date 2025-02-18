const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot's API token
const token = '7099569188:AAEgxVf1F6JMvILf5-g0hC1cBysDGOnM4KY';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// Log when the bot starts
console.log('Bot is running...');

// Listen for new messages in the channel
bot.on('channel_post', (msg) => {
    const postId = msg.message_id;
    const chatId = msg.chat.id;
    const text = msg.text || 'No text available';
    const usrname = msg

    console.log(`New post in channel ${chatId}:`);
    console.log(`Post ID: ${postId}`);
    console.log(`Content: ${text}`);
    console.log(`Channel Username: ${usrname}` )
});

// Handle errors
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error}`);
});