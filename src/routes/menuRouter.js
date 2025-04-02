const express = require("express");
const menuController = require("../src/controllers/menuController");
const menuRouter = express.Router();

// Menu Routes
menuRouter.post("/", menuController.addMenu);
menuRouter.get("/", menuController.getRestaurantMenu);
menuRouter.get("/filter", menuController.filterMenuItems);
menuRouter.put("/:menuId", menuController.updateMenuItem);
menuRouter.delete("/:menuId", menuController.deleteMenuItem);

module.exports = menuRouter;
