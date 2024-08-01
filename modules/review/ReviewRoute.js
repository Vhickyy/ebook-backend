import { authMiddleware } from "../../middleware/authMiddleware.js";
import { loginValidation} from "../../middleware/validationMiddleware.js";
import ReviewController from "./ReviewController.js";
import express from "express";

const ReviewRouter = express.Router();
const reviewController = new ReviewController()

ReviewRouter.post("/:id", authMiddleware, reviewController.postReview);
// ReviewRouter.get("/",  reviewController.getAllReview);
// ReviewRouter.get("/:id",  reviewController.getReview);
// ReviewRouter.patch("/:id", authMiddleware,  reviewController.updateReview);
// ReviewRouter.delete("/:id", authMiddleware,  reviewController.deleteReview);

export default ReviewRouter;