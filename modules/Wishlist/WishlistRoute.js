import express from "express";
import WishlistController from "./WishlistController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const wishlistController = new WishlistController

const WishlistRouter = express.Router();

WishlistRouter.post("/",authMiddleware,wishlistController.createWishlist);
WishlistRouter.delete("/:id",authMiddleware,wishlistController.removeWishlistItem);
WishlistRouter.get("/",authMiddleware,wishlistController.getWishlist)
WishlistRouter.delete("/",authMiddleware,wishlistController.clearWishlist)


export default WishlistRouter;