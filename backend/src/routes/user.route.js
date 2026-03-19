import { Router } from "express";
import {
	adminListUsersController,
	adminUpdateUserRoleController,
	getCurrentUserController,
	updateUserController,
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinary.config.js";
import { authorizeRoles } from "../middlewares/authorize-role.middleware.js";

const userRoutes = Router();

userRoutes.get("/current-user", getCurrentUserController);
userRoutes.put("/update", upload.single("profilePicture"), updateUserController);
userRoutes.get("/admin/users", authorizeRoles("ADMIN"), adminListUsersController);
userRoutes.patch("/admin/users/:userId/role", authorizeRoles("ADMIN"), adminUpdateUserRoleController);

export default userRoutes;
