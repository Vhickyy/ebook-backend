import { authMiddleware } from "../../middleware/authMiddleware.js";
import { loginValidation, registerValidation } from "../../middleware/validationMiddleware.js";
import AuthController from "./AuthContoller.js";
import express from "express";
import upload from "../../middleware/multer.js";

const AuthRouter = express.Router();
const authController = new AuthController()

// registerValidation,
AuthRouter.post("/register", upload.single('profilePic'), registerValidation,  authController.registerUser);
AuthRouter.post("/login", authController.loginUser);
AuthRouter.get("/logout", authController.logout);
AuthRouter.post("/verify-email", authController.verifyEmail);
AuthRouter.post("/resend-otp", authController.resendOtp);
AuthRouter.post("/forgot-password", authController.forgotPassword);
AuthRouter.post("/reset-password", authController.resetPassword);
AuthRouter.get("/user", authMiddleware, authController.getUser);
AuthRouter.get("/get-author/:authorId", authController.getAuthor);


// ==================== Assist dummy mail route =============== //
AuthRouter.get("/getCode/:email", authController.getEmailVerifyCode);
AuthRouter.get("/getForgotPasswordCode/:email", authController.getForgotPasswordCode);

export default AuthRouter;