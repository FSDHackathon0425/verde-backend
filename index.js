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

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  const userName = msg.from.first_name || "Usuario";

  console.log(msg);

  // Mensaje de bienvenida
  if (messageText === "/start") {
    return bot.sendMessage(
      chatId,
      `Hola, ${userName}! 👋 Bienvenido al bot del restaurante. Escribe /menu para ver el menú.`
    );
  }

  // Menú
  if (messageText === "/menu") {
    // 1️⃣ Opciones rápidas tipo "Kebab", "Durum"
    const menuMessage = `¡Aquí tienes el menú del restaurante! 🍽️\n\nSelecciona una opción o desplázate más abajo para ver todos los platos:`;

    const quickOptions = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🍖 Kebab", callback_data: "menu_kebab" }],
          [{ text: "🌯 Durum", callback_data: "menu_durum" }],
        ],
      },
    };

    await bot.sendMessage(chatId, menuMessage, quickOptions);

    // 2️⃣ Mostrar menú real desde base de datos
    try {
      const items = await Menu.find().populate("restauranteId");

      if (items.length === 0) {
        return bot.sendMessage(chatId, "No hay platos disponibles ahora mismo.");
      }

      items.forEach((item) => {
        const nombreRestaurante = item.restauranteId?.nombre || "Restaurante";

        const text = `🍽 *${item.titulo}*  \n_${nombreRestaurante}_\n${item.descripcion}\n💸 *${item.precio}€*`;
        const options = {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [[
              { text: "🛒 Pedir", callback_data: `order_${item._id}_${chatId}` }
            ]],
          },
        };

        bot.sendMessage(chatId, text, options);
      });
    } catch (error) {
      console.error("❌ Error al obtener el menú:", error);
      bot.sendMessage(chatId, "❌ Error al obtener el menú.");
    }
  }
});


// Manejo de las respuestas de los botones
bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  // Lógica de crear pedido
  if (data.startsWith("order_")) {
    const [_, menuId, userId] = data.split("_");

    try {
      const pedido = new Pedido({
        userId: msg.chat.id,
        menuId,
        completado: false,
        usuarioNombre: msg.chat.first_name || "Anon"
      });

      const savedPedido = await pedido.save();

      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Completar", callback_data: `complete_${savedPedido._id}` },
              { text: "❌ Cancelar", callback_data: `cancel_${savedPedido._id}` }
            ]
          ]
        }
      };

      bot.sendMessage(msg.chat.id, "🛒 Pedido creado. ¿Qué quieres hacer?", options);
    } catch (error) {
      console.error("❌ Error al crear el pedido:", error);
      bot.sendMessage(msg.chat.id, "❌ Error al procesar el pedido.");
    }
  }

  // Lógica para completar pedido (validando que sea del usuario)
  if (data.startsWith("complete_")) {
    const pedidoId = data.split("_")[1];
    try {
      const pedido = await Pedido.findById(pedidoId);
      if (!pedido) return bot.sendMessage(msg.chat.id, "❌ Pedido no encontrado.");

      if (pedido.userId !== msg.chat.id.toString()) {
        return bot.sendMessage(msg.chat.id, "🚫 No puedes completar un pedido que no es tuyo.");
      }

      await Pedido.findByIdAndUpdate(pedidoId, { completado: true });
      bot.sendMessage(msg.chat.id, "✅ Pedido marcado como completado.");
    } catch (error) {
      console.error("❌ Error al completar pedido:", error);
      bot.sendMessage(msg.chat.id, "❌ No se pudo completar el pedido.");
    }
  }

  // Lógica para cancelar pedido (validando que sea del usuario)
  if (data.startsWith("cancel_")) {
    const pedidoId = data.split("_")[1];
    try {
      const pedido = await Pedido.findById(pedidoId);
      if (!pedido) return bot.sendMessage(msg.chat.id, "❌ Pedido no encontrado.");

      if (pedido.userId !== msg.chat.id.toString()) {
        return bot.sendMessage(msg.chat.id, "🚫 No puedes cancelar un pedido que no es tuyo.");
      }

      await Pedido.findByIdAndDelete(pedidoId);
      bot.sendMessage(msg.chat.id, "❌ Pedido cancelado y eliminado.");
    } catch (error) {
      console.error("❌ Error al cancelar pedido:", error);
      bot.sendMessage(msg.chat.id, "❌ No se pudo cancelar el pedido.");
    }
  }

  // Lógica de opciones especiales tipo "Durum con patatas", etc.
  const menuOptions = {
    menu_kebab_bebida: "🍖 Kebab con bebida",
    menu_kebab_patatas: "🍖 Kebab con patatas",
    menu_kebab_ambas: "🍖 Kebab con bebida y patatas",
    menu_durum_bebida: "🌯 Durum con bebida",
    menu_durum_patatas: "🌯 Durum con patatas",
    menu_durum_ambas: "🌯 Durum con bebida y patatas",
  };

  if (menuOptions[data]) {
    bot.sendMessage(msg.chat.id, `Has seleccionado: ${menuOptions[data]}.`);
  }

  // Siempre responde al callback para evitar errores en Telegram
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
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* app.use("/api/users", usuarioRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", pedidoRouter);
app.use("/api/restaurants", restauranteRouter); */

// Arrancamos el servidor para que escuche llamadas
app.listen(port, () => {
  console.log(" El servidor está escuchando en el puerto " + port);
});
