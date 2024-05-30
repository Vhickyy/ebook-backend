import express from "express";
import AnonymousCartController from "./AnonymousCartController.js";

const AnnonymousRouter = express.Router();
const annonymousController = new AnonymousCartController;

AnnonymousRouter.post("/",annonymousController.createCart)
AnnonymousRouter.get("/:id",annonymousController.getCart)
AnnonymousRouter.patch("/:id",annonymousController.removeCartItem)
AnnonymousRouter.delete("/:id",annonymousController.clearCart)

export default AnnonymousRouter

// product page 
// no discount, no stock
// seller verification
// email, smtp
// testing
// donation login and verification
// phone number wahala