import { Router } from "express";
import {
	adminListUsersController,
	adminUpdateUserRoleController,
	getCurrentUserController,
	updateUserController,
    changeUserPasswordController,
    deleteUserAccountController,
    requestEmailUpdateController,
    verifyEmailUpdateController
} from "../controllers/user.controller.js";
import { upload } from "../config/cloudinary.config.js";
import { authorizeRoles } from "../middlewares/authorize-role.middleware.js";

const userRoutes = Router();

userRoutes.get("/current-user", getCurrentUserController);
userRoutes.put("/update", upload.single("profilePicture"), updateUserController);
userRoutes.patch("/password", changeUserPasswordController);
userRoutes.delete("/account", deleteUserAccountController);

userRoutes.post("/email/request-update", requestEmailUpdateController);
userRoutes.post("/email/verify-update", verifyEmailUpdateController);

userRoutes.get("/admin/users", authorizeRoles("ADMIN"), adminListUsersController);
userRoutes.patch("/admin/users/:userId/role", authorizeRoles("ADMIN"), adminUpdateUserRoleController);

export default userRoutes;
