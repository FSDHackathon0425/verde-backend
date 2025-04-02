require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

/***
 * BOT Commands
 ***/
const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const usuarioRouter = require("./src/routes/usuarioRouter");
const menuRouter = require("./src/routes/menuRouter");
const pedidoRouter = require("./src/routes/pedidoRouter");
const restauranteRouter = require("./src/routes/restauranteRouter");

// Modelos para el bot
const Menu = require("./src/models/Menu");
const Pedido = require("./src/models/Pedido");

// Mostrar menú de un restaurante
bot.onText(/\/menu (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const restaurantId = match[1];

  try {
    const items = await Menu.find({ restauranteId });

    if (items.length === 0) {
      return bot.sendMessage(chatId, "No hay menú disponible.");
    }

    items.forEach((item) => {
      const text = `🍽 *${item.titulo}*\n${item.descripcion}\n💸 ${item.precio}€`;
      const options = {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{
            text: "Pedir",
            callback_data: `order_${item._id}_${chatId}`,
          }]],
        },
      };
      bot.sendMessage(chatId, text, options);
    });
  } catch (error) {
    console.error("❌ Error al obtener el menú:", error);
    bot.sendMessage(chatId, "❌ Error al obtener el menú.");
  }
});

// Crear pedido desde botón
bot.on("callback_query", async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  // Crear pedido: "order_<menuId>_<chatId>"
  if (data.startsWith("order_")) {
    const [_, menuId, userId] = data.split("_");

    try {
      const pedido = new Pedido({
        userId: msg.chat.id, // Telegram user ID (chatId)
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

  // Completar pedido (solo si es del mismo usuario)
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

  // Cancelar pedido (solo si es del mismo usuario)
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
});


// Ver pedidos del usuario
bot.onText(/\/mispedidos/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const pedidos = await Pedido.find({ userId: chatId }).populate("menuId");

    if (pedidos.length === 0) {
      return bot.sendMessage(chatId, "No tienes pedidos todavía.");
    }

    let mensaje = "📦 *Tus pedidos:*\n\n";
    pedidos.forEach((p, i) => {
      mensaje += `#${i + 1} - *${p.menuId.titulo}* - ${p.completado ? "✅ Completado" : "🕒 Pendiente"}\n`;
    });

    bot.sendMessage(chatId, mensaje, { parse_mode: "Markdown" });
  } catch (error) {
    console.error("❌ Error al obtener pedidos:", error);
    bot.sendMessage(chatId, "❌ Error al obtener tus pedidos.");
  }
});

/***
 * END BOT Commands
 ***/

/***
 * HTTP Express Backend Commands
 ***/

const port = 3333;

// MongoDB URI desde .env
const MONGODB_URI = process.env.MONGO_URL;

// Instanciamos express
const app = express();

// Hacemos que funcione el req.body
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Rutas API
app.use("/api/users", usuarioRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", pedidoRouter);
app.use("/api/restaurants", restauranteRouter);

// Arrancamos el servidor
app.listen(port, () => {
  console.log("🚀 El servidor está escuchando en el puerto " + port);
});
