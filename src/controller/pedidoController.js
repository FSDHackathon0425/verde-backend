const Pedido = require("../models/Pedido");

exports.createOrder = async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    const saved = await pedido.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate("menuId userId");
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate("menuId userId");
    res.json(pedido);
  } catch (err) {
    res.status(404).json({ error: "Pedido no encontrado" });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ userId: req.params.userId }).populate("menuId");
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updated = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
