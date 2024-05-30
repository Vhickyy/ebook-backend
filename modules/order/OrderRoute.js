import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import OrderController from "./OrderController.js";

const OrderRouter = express.Router();
const orderController = new OrderController;

OrderRouter.post("/",authMiddleware,orderController.createOrder);
OrderRouter.get("/",authMiddleware,orderController.getAllOrdersForUser);
OrderRouter.get("/:reference",authMiddleware,orderController.verifyOrder);

export default OrderRouter;