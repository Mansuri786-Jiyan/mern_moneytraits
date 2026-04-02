import { Router } from "express";
import { authorizeRoles } from "../middlewares/authorize-role.middleware.js";
import { passportAuthenticateJwt } from "../config/passport.config.js";
import {
    getAdminDashboardController,
    getAdminUsersController,
    updateAdminUserRoleController,
    deleteAdminUserController,
    getAdminTransactionsController,
    getAdminAnalyticsController,
    toggleAdminUserBlockController
} from "../controllers/admin.controller.js";

const adminRoutes = Router();

// Apply global middleware to all admin routes
adminRoutes.use(passportAuthenticateJwt);
adminRoutes.use(authorizeRoles("ADMIN"));

adminRoutes.get("/dashboard", getAdminDashboardController);
adminRoutes.get("/users", getAdminUsersController);
adminRoutes.patch("/users/:id/role", updateAdminUserRoleController);
adminRoutes.patch("/users/:id/block", toggleAdminUserBlockController);
adminRoutes.delete("/users/:id", deleteAdminUserController);
adminRoutes.get("/transactions", getAdminTransactionsController);
adminRoutes.get("/analytics", getAdminAnalyticsController);

export default adminRoutes;
