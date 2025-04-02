const express = require("express");
const menuController = require("../../controllers/menuController");
const menuRouter = express.Router();

// ✅ Nuevas rutas sin restauranteId
menuRouter.post("/", menuController.addMenu);
menuRouter.get("/", menuController.getMenus);
menuRouter.post("/bulk", menuController.addMenusBulk);
menuRouter.put("/:menuId", menuController.updateMenuItem);
menuRouter.delete("/:menuId", menuController.deleteMenuItem);

module.exports = menuRouter;
