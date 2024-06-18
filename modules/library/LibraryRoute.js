import express from "express";
import LibraryController from "./LibraryController.js"
import { authMiddleware } from "../../middleware/authMiddleware.js";

const LibraryRouter = express.Router();
const libraryController = new LibraryController;


LibraryRouter.get("/", authMiddleware,libraryController.getLibrary);
LibraryRouter.get("/:id",authMiddleware,libraryController.getPdf);
// LibraryRouter.patch("/:id",authMiddleware,libraryController.removeCartItem);
// LibraryRouter.delete("/:id",authMiddleware,libraryController.clearCart);

export default LibraryRouter;