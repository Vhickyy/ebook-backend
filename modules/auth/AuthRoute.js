import { authMiddleware } from "../../middleware/authMiddleware.js";
import { loginValidation, registerValidation } from "../../middleware/validationMiddleware.js";
import AuthController from "./AuthContoller.js";
import express from "express";

const AuthRouter = express.Router();
const authController = new AuthController()

// registerValidation,
AuthRouter.post("/register", registerValidation, authController.registerUser);
AuthRouter.post("/login", authController.loginUser);
AuthRouter.post("/logout", authController.logout);
AuthRouter.post("/verify-email", authController.verifyEmail);
AuthRouter.post("/resend-otp", authController.resendOtp);
AuthRouter.post("/forgot-password", authController.forgotPassword);
AuthRouter.post("/verify-forgot-otp", authController.verifyForgotPasswordCode);
AuthRouter.post("/resend-forgot-otp", authController.resendForgotPasswordOtpndOtp);
AuthRouter.post("/reset-password", authController.resetPassword);
AuthRouter.get("/user", authMiddleware, authController.getUser);

export default AuthRouter;