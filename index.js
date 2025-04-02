require("dotenv").config();

/***
 * BOT Commands
 ***/
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  console.log(msg);

  // Process the incoming message here
  if (messageText === "/start") {
    bot.sendMessage(chatId, "Hello World!");
    const photoUrl = "https://www.example.com/image.png";
    bot.sendPhoto(chatId, photoUrl, { caption: "Here is your photo!" });
    const inlineKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Option 1", callback_data: "1" }],
          [{ text: "Option 2", callback_data: "2" }],
          [{ text: "Option 3", callback_data: "3" }],
        ],
      },
    };

    // Send a message with the inline keyboard
    bot.sendMessage(chatId, "Choose an option:", inlineKeyboard);
  }
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  // Send a message based on the callback data
  bot.sendMessage(message.chat.id, `You selected option ${data}`);
});

/***
 * END BOT Commands
 ***/

/***
 * HTTP Express Backend Commands
 ***/

// Importamos o requerimos express
const express = require("express");
const port = 3333;

//Instanciamos express
const app = express();

//Hacemos que funcione el req.body
app.use(express.json());

// Arrancamos el servidor para que escuche llamadas
app.listen(port, () => {
  console.log("🚀 El servidor está escuchando en el puerto " + port);
});
