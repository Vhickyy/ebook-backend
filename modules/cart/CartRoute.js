import express from "express";
import CartController from "./CartController.js"
import { authMiddleware } from "../../middleware/authMiddleware.js";

const CartRouter = express.Router();
const cartController = new CartController;


CartRouter.post("/", authMiddleware,cartController.createCart);
CartRouter.get("/",authMiddleware,cartController.getCart);
CartRouter.patch("/:id",authMiddleware,cartController.removeCartItem);
CartRouter.delete("/:id",authMiddleware,cartController.clearCart);

export default CartRouter;