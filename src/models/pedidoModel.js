const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  usuarioNombre: { type: String },
  menuId: { type: String, ref: "Menu", required: true },
  completado: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pedido", pedidoSchema);
