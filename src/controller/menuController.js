const Menu = require("../models/menuModel");

// Crear un nuevo menú
exports.addMenu = async (req, res) => {
  try {
    const { titulo, descripcion, precio } = req.body;

    if (!titulo || !precio) {
      return res
        .status(400)
        .json({ error: "El título y el precio son requeridos." });
    }

    const menu = new Menu({
      titulo,
      descripcion,
      precio,
    });

    const saved = await menu.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Crear múltiples menús (Bulk Insert)
exports.addMenusBulk = async (req, res) => {
  try {
    const savedMenus = await Menu.insertMany(req.body);
    res.status(201).json(savedMenus);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los menús
exports.getMenus = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filtrar menús por precio (opcional)
exports.filterMenuItems = async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    const filter = {
      precio: {
        $gte: Number(minPrice) || 0,
        $lte: Number(maxPrice) || Infinity,
      },
    };

    const filtered = await Menu.find(filter);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un menú existente
exports.updateMenuItem = async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.menuId, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "El menú no fue encontrado." });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar un menú
exports.deleteMenuItem = async (req, res) => {
  try {
    const deleted = await Menu.findByIdAndDelete(req.params.menuId);

    if (!deleted) {
      return res.status(404).json({ error: "El menú no fue encontrado." });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
