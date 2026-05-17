import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import {
    findByIdUserService,
    listUsersService,
    updateUserRoleService,
    updateUserService,
    changeUserPasswordService,
    deleteUserAccountService,
    requestEmailUpdateService,
    verifyEmailUpdateService,
} from "../services/user.service.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { updateUserRoleSchema, updateUserSchema, changePasswordSchema, requestEmailUpdateSchema, verifyEmailUpdateSchema } from "../validators/user.validator.js";

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

export const changeUserPasswordController = asyncHandler(async (req, res) => {
    const body = changePasswordSchema.parse(req.body);
    const userId = req.user?._id;
    await changeUserPasswordService(userId, body.currentPassword, body.newPassword);
    
    return res.status(HTTPSTATUS.OK).json({
        message: "Password changed successfully",
    });
});

export const deleteUserAccountController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    await deleteUserAccountService(userId);
    
    // Clear the authentication cookie
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(HTTPSTATUS.OK).json({
        message: "Account deleted successfully",
    });
});

export const requestEmailUpdateController = asyncHandler(async (req, res) => {
    const body = requestEmailUpdateSchema.parse(req.body);
    const userId = req.user?._id;
    await requestEmailUpdateService(userId, body.newEmail, body.password);

    return res.status(HTTPSTATUS.OK).json({
        message: "Verification OTP sent to your new email",
    });
});

export const verifyEmailUpdateController = asyncHandler(async (req, res) => {
    const body = verifyEmailUpdateSchema.parse(req.body);
    const userId = req.user?._id;
    const user = await verifyEmailUpdateService(userId, body.otp);

    return res.status(HTTPSTATUS.OK).json({
        message: "Email updated successfully",
        data: user,
    });
});
