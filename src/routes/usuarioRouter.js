const express = require("express");
const userController = require("../controllers/userController");
const userRouter = express.Router();

// Rutas para el administrador
userRouter.get("/", userController.getUsers);
userRouter.get("/:id", userController.getUser);
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

// Rutas para el usuario
userRouter.get("/profile", userController.getProfile);
userRouter.put("/profile", userController.updateProfile);
userRouter.delete("/profile", userController.deleteProfile);

module.exports = userRouter;
