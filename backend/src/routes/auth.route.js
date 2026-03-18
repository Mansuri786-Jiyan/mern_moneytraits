import { Router } from "express";
import {
    registerController,
    loginController,
    refreshTokenController,
    logoutController,
} from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/register", registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/refresh-token", refreshTokenController);
authRoutes.post("/logout", logoutController);

export default authRoutes;
