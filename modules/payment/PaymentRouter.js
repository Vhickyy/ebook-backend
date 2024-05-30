import express from "express";
import PaystackController from "./PaymentController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const paystackController = new PaystackController()
const PaymentRouter = express.Router();

// PaymentRouter.get("/",authMiddleware,paystackController.verifyPayment)
// PaymentRouter.post("/",authMiddleware,paystackController.initializePayment)


export default PaymentRouter