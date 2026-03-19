import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import {
    findByIdUserService,
    listUsersService,
    updateUserRoleService,
    updateUserService,
} from "../services/user.service.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { updateUserRoleSchema, updateUserSchema } from "../validators/user.validator.js";

export const getCurrentUserController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const user = await findByIdUserService(userId);
    return res.status(HTTPSTATUS.OK).json({
        message: "User fetched successfully",
        user,
    });
});

export const updateUserController = asyncHandler(async (req, res) => {
    const body = updateUserSchema.parse(req.body);
    const userId = req.user?._id;
    const profilePic = req.file;
    const user = await updateUserService(userId, body, profilePic);
    return res.status(HTTPSTATUS.OK).json({
        message: "User profile updated successfully",
        data: user,
    });
});

export const adminListUsersController = asyncHandler(async (_req, res) => {
    const users = await listUsersService();
    return res.status(HTTPSTATUS.OK).json({
        message: "Users fetched successfully",
        users,
    });
});

export const adminUpdateUserRoleController = asyncHandler(async (req, res) => {
    const body = updateUserRoleSchema.parse(req.body);
    const targetUserId = req.params.userId;
    const currentUserId = req.user?._id;
    const user = await updateUserRoleService(targetUserId, body.role, currentUserId);

    return res.status(HTTPSTATUS.OK).json({
        message: "User role updated successfully",
        user,
    });
});
