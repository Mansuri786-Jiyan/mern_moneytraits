import UserModel from "../models/user.model.js";
import { BadRequestException, NotFoundException } from "../utils/app-error.js";

export const findByIdUserService = async (userId) => {
    const user = await UserModel.findById(userId);
    return user?.omitPassword();
};

export const updateUserService = async (userId, body, profilePic) => {
    const user = await UserModel.findById(userId);
    if (!user)
        throw new NotFoundException("User not found");
    if (profilePic) {
        user.profilePicture = profilePic.path;
    }
    user.set({
        name: body.name,
    });
    await user.save();
    return user.omitPassword();
};

export const listUsersService = async () => {
    return UserModel.find({}, {
        name: 1,
        email: 1,
        profilePicture: 1,
        role: 1,
        createdAt: 1,
    }).sort({ createdAt: -1 }).lean();
};

export const updateUserRoleService = async (targetUserId, role, currentUserId) => {
    if (String(targetUserId) === String(currentUserId) && role !== "ADMIN") {
        throw new BadRequestException("You cannot remove your own admin role");
    }

    const user = await UserModel.findById(targetUserId);
    if (!user)
        throw new NotFoundException("User not found");

    user.role = role;
    await user.save();
    return user.omitPassword();
};
