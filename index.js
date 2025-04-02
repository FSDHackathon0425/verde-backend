require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

/***
 * BOT Commands
 ***/
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

/* const usuarioRouter = require("./routes/usuarioRouter");
const menuRouter = require("./routes/menuRouter");
const pedidoRouter = require("./routes/pedidoRouter");
const restauranteRouter = require("./routes/restauranteRouter"); */
/* routes */

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const userName = msg.from.first_name || "Usuario";

  console.log(msg);

  if (messageText === "/start") {
    bot.sendMessage(
      chatId,
      `Hola, ${userName}! Bienvenido al bot del restaurante. Escribe /menu para ver el menú.`
    );
  }

  if (messageText === "/menu") {
    const menuMessage = `
¡Aquí tienes el menú del restaurante! 🍽️

Por favor, selecciona el menú que deseas pedir:
`;

    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🍖 Kebab", callback_data: "menu_kebab" }],
          [{ text: "🌯 Durum", callback_data: "menu_durum" }],
        ],
      },
    };

    bot.sendMessage(chatId, menuMessage, options);
  }
});

// Manejo de las respuestas de los botones
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;

  if (data === "menu_kebab" || data === "menu_durum") {
    const menuName = data === "menu_kebab" ? "🍖 Kebab" : "🌯 Durum";

    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Con bebida", callback_data: `${data}_bebida` }],
          [{ text: "Con patatas", callback_data: `${data}_patatas` }],
          [{ text: "Ambas", callback_data: `${data}_ambas` }],
        ],
      },
    };

    bot.sendMessage(
      message.chat.id,
      `Has seleccionado: ${menuName}. ¿Qué deseas añadir?`,
      options
    );
  }

  // Respuesta a las selecciones específicas
  const menuOptions = {
    menu_kebab_bebida: "🍖 Kebab con bebida",
    menu_kebab_patatas: "🍖 Kebab con patatas",
    menu_kebab_ambas: "🍖 Kebab con bebida y patatas",
    menu_durum_bebida: "🌯 Durum con bebida",
    menu_durum_patatas: "🌯 Durum con patatas",
    menu_durum_ambas: "🌯 Durum con bebida y patatas",
  };

  if (menuOptions[data]) {
    bot.sendMessage(message.chat.id, `Has seleccionado: ${menuOptions[data]}.`);
  }

  bot.answerCallbackQuery(callbackQuery.id); // Responder al callback para evitar errores
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

const MONGODB_URI =
  "mongodb+srv://" +
  process.env.MONGODB_USER +
  ":" +
  process.env.MONGODB_PASSWORD +
  "@" +
  process.env.MONGODB_HOST +
  "/" +
  process.env.MONGODB_DB +
  "?authSource=admin&replicaSet=myRepl";

//Instanciamos express
const app = express();

//Hacemos que funcione el req.body
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* app.use("/api/users", usuarioRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", pedidoRouter);
app.use("/api/restaurants", restauranteRouter); */

// Arrancamos el servidor para que escuche llamadas
app.listen(port, () => {
  console.log("🚀 El servidor está escuchando en el puerto " + port);
});
