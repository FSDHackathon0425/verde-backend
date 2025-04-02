const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  usuarioNombre: { type: String },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
  completado: { type: Boolean, default: false },
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Pedido", pedidoSchema);
