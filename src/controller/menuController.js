const Menu = require("../models/Menu");

exports.addMenu = async (req, res) => {
  try {
    const menu = new Menu({ ...req.body, restauranteId: req.params.restaurantId });
    const saved = await menu.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRestaurantMenu = async (req, res) => {
  try {
    const items = await Menu.find({ restauranteId: req.params.restaurantId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.filterMenuItems = async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    const filter = {
      restauranteId: req.params.restaurantId,
      precio: { $gte: minPrice || 0, $lte: maxPrice || Infinity },
    };
    const filtered = await Menu.find(filter);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
