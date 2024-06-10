import { authMiddleware, authMiddlewareNoError } from "../../middleware/authMiddleware.js";
import upload from "../../middleware/multer.js";
import { bookValidation, loginValidation, paramIdValidation} from "../../middleware/validationMiddleware.js";
import BookController from "./BookController.js";
import express from "express";

const BookRouter = express.Router();
const bookController = new BookController()

// upload.single('pdf'),upload.single('frontCover'),upload.single('backCover'),
BookRouter.post("/",authMiddleware,upload.fields([{ name: 'pdf', maxCount: 1 },{ name: 'frontCover', maxCount: 1 },{ name: 'backCover', maxCount: 1 }]),  bookValidation, bookController.createBook);
BookRouter.get("/", authMiddlewareNoError,  bookController.getAllBooks);
BookRouter.get("/author/:id",  bookController.getAllAuthorBooks);
BookRouter.get("/:id", authMiddlewareNoError, paramIdValidation,  bookController.getBook);
BookRouter.patch("/:id", authMiddleware, paramIdValidation, upload.fields([{ name: 'pdf', maxCount: 1 },{ name: 'frontCover', maxCount: 1 },{ name: 'backCover', maxCount: 1 }]),bookValidation,  bookController.updateBook);
BookRouter.delete("/:id", authMiddleware, paramIdValidation,  bookController.deleteBook);

export default BookRouter;
