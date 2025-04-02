require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const Menu = require("./src/models/menuModel");
const Pedido = require("./src/models/pedidoModel");
/***
 * BOT Commands
 ***/
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

/* const usuarioRouter = require("./src/routes/usuarioRouter");
const menuRouter = require("./src/routes/menuRouter");
const pedidoRouter = require("./src/routes/pedidoRouter");
const restauranteRouter = require("./src/routes/restauranteRouter"); */

const getMenus = async () => {
  return [
    {
      _id: "1",
      titulo: "Menu 1",
      descripcion: "Descripción del menú 1",
      precio: 10,
    },
    {
      _id: "2",
      titulo: "Menu 2",
      descripcion: "Descripción del menú 2",
      precio: 15,
    },
    {
      _id: "3",
      titulo: "Menu 3",
      descripcion: "Descripción del menú 3",
      precio: 20,
    },
  ];
  // return await Menu.find();
};

const postPedido = async (userId, usuarioNombre, menuId) => {
  const pedido = new Pedido({
    userId: userId,
    usuarioNombre: usuarioNombre,
    menuId: menuId,
    completado: false,
  });
  await pedido.save();
  return pedido;
};

bot.on("message", async (msg) => {
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
    const menus = await getMenus();

    const menuMessage = `
¡Aquí tienes el menú del restaurante! 🍽️

Por favor, selecciona el menú que deseas pedir:
`;

    const options = {
      reply_markup: {
        inline_keyboard: menus.map((menu) => [
          {
            text: `${menu.titulo} - ${menu.precio}€`,
            callback_data: `${menu._id}`,
          },
        ]),
      },
    };

    bot.sendMessage(chatId, menuMessage, options);
  }
});

// Manejo de las respuestas de los botones
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data; // Este es el menuId que debes guardar
  const chatId = message.chat.id;
  const userName = message.chat.first_name;

  postPedido(chatId, userName, data);
  bot.sendMessage(
    chatId,
    `Gracias por tu pedido, ${userName}! Has seleccionado el menú con ID: ${data}.`
  );

  bot.answerCallbackQuery(callbackQuery.id);
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

// Habilitar CORS para todas las rutas
app.use(cors()); // <--- Añadido aquí

//Hacemos que funcione el req.body
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
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
