const Menu = require("../models/menuModel");

exports.addMenu = async (req, res) => {
  try {
    const menu = new Menu(req.body);
    const saved = await menu.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenusBulk = async (req, res) => {
  try {
    const savedMenus = await Menu.insertMany(req.body);
    res.status(201).json(savedMenus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.menuId, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.menuId);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
