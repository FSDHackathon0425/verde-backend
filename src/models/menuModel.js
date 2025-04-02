const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
});

module.exports = mongoose.model("Menu", menuSchema);
