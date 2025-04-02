const express = require("express");
const menuController = require("../src/controllers/menuController");
const menuRouter = express.Router();

// Menu Routes
menuRouter.post("/", menuController.addMenu); // Añadir un menú
menuRouter.get("/", menuController.getMenus); // Obtener todos los menús
menuRouter.post("/bulk", menuController.addMenusBulk); // Añadir múltiples menús (Bulk Insert)
menuRouter.get("/filter", menuController.filterMenuItems); // Filtrar menús por precio
menuRouter.put("/:menuId", menuController.updateMenuItem); // Actualizar un menú por su ID
menuRouter.delete("/:menuId", menuController.deleteMenuItem); // Eliminar un menú por su ID

module.exports = menuRouter;
