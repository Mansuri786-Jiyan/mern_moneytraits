import { Router } from "express";
import {
    forgotPasswordController,
    verifyOtpController,
    resetPasswordController,
} from "../controllers/password-reset.controller.js";

const passwordResetRoutes = Router();

passwordResetRoutes.post("/forgot-password", forgotPasswordController);
passwordResetRoutes.post("/verify-otp", verifyOtpController);
passwordResetRoutes.post("/reset-password", resetPasswordController);

export default passwordResetRoutes;
