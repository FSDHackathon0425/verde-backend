const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const restaurantRouter = express.Router();

restaurantRouter.post("/", restaurantController.createRestaurant);
restaurantRouter.get("/", restaurantController.getRestaurants);
restaurantRouter.get("/:id", restaurantController.getRestaurant);
restaurantRouter.put("/:id", restaurantController.updateRestaurant);
restaurantRouter.patch("/:id", restaurantController.patchRestaurant);
restaurantRouter.delete("/:id", restaurantController.deleteRestaurant);

// Obtener restaurantes de una misma marca
restaurantRouter.get(
  "/brands/:brandName",
  restaurantController.getRestaurantsByBrand
);

module.exports = restaurantRouter;
