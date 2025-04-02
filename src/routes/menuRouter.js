const express = require("express");
const menuController = require("../../controllers/menuController");
const menuRouter = express.Router();

// Menu Routes
menuRouter.post("/:restaurantId/menu", menuController.addMenu);
menuRouter.get("/:restaurantId/menu", menuController.getRestaurantMenu);
menuRouter.get("/:restaurantId/menu/filter", menuController.filterMenuItems);
menuRouter.put("/:restaurantId/menu/:menuId", menuController.updateMenuItem);
menuRouter.delete("/:restaurantId/menu/:menuId", menuController.deleteMenuItem);

module.exports = menuRouter;
