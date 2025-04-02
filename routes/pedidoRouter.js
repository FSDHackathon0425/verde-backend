const express = require("express");
const orderController = require("../controllers/pedidoController");
const orderRouter = express.Router();

// Order Routes
orderRouter.post("/", authMiddleware, orderController.createOrder);
orderRouter.get("/", orderController.getOrders);
orderRouter.get("/:id", orderController.getOrder);
orderRouter.get("/:userId", orderController.getOrdersByUser);
orderRouter.put("/:id", orderController.updateOrder);
orderRouter.delete("/:id", orderController.deleteOrder);

// Add this line to export the router
module.exports = orderRouter;
