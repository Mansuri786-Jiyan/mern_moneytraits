import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import UserModel from "../models/user.model.js";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import { NotFoundException, BadRequestException } from "../utils/app-error.js";
import { updateUserRoleSchema } from "../validators/user.validator.js";
import { convertToDollarUnit } from "../utils/format-currency.js";
import { maskEmail, maskName } from "../utils/privacy.js";
import { subDays, startOfDay, endOfDay } from "date-fns";

export const getAdminDashboardController = asyncHandler(async (req, res) => {
    const totalUsers = await UserModel.countDocuments();

    const stats = await TransactionModel.aggregate([
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: {
                        $cond: [{ $eq: ["$type", TransactionTypeEnum.INCOME] }, "$amount", 0]
                    }
                },
                totalExpenses: {
                    $sum: {
                        $cond: [{ $eq: ["$type", TransactionTypeEnum.EXPENSE] }, "$amount", 0]
                    }
                }
            }
        }
    ]);

const { totalIncome = 0, totalExpenses = 0 } = stats[0] || {};

return res.status(HTTPSTATUS.OK).json({
    message: "Admin dashboard stats fetched successfully",
    data: {
        totalUsers,
        totalIncome: convertToDollarUnit(totalIncome),
        totalExpenses: convertToDollarUnit(totalExpenses)
    }
});
});

export const getAdminUsersController = asyncHandler(async (req, res) => {
    const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
    return res.status(HTTPSTATUS.OK).json({
        message: "All users fetched successfully",
        data: users
    });
});

export const updateAdminUserRoleController = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const body = updateUserRoleSchema.parse(req.body);

    if (String(userId) === String(req.user._id) && body.role !== "ADMIN") {
        throw new BadRequestException("You cannot remove your own admin role");
    }

    const user = await UserModel.findByIdAndUpdate(
        userId,
        { role: body.role },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new NotFoundException("User not found");
    }

    return res.status(HTTPSTATUS.OK).json({
        message: "User role updated successfully",
        data: user
    });
});

export const deleteAdminUserController = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (String(userId) === String(req.user._id)) {
        throw new BadRequestException("You cannot delete your own admin account");
    }

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
        throw new NotFoundException("User not found");
    }

    return res.status(HTTPSTATUS.OK).json({
        message: "User deleted successfully"
    });
});

export const toggleAdminUserBlockController = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (String(userId) === String(req.user._id)) {
        throw new BadRequestException("You cannot block your own admin account");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new NotFoundException("User not found");
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.status(HTTPSTATUS.OK).json({
        message: user.isBlocked ? "User has been blocked successfully" : "User has been unblocked successfully",
        data: user.omitPassword()
    });
});

export const getAdminTransactionsController = asyncHandler(async (req, res) => {
    const transactions = await TransactionModel.find()
        .populate("userId", "name email profilePicture")
        .sort({ date: -1 });

    const maskedTransactions = transactions.map(tx => {
        const txObj = tx.toObject({ getters: true });
        if (txObj.userId) {
            txObj.userId.email = maskEmail(txObj.userId.email);
            txObj.userId.name = maskName(txObj.userId.name);
        }
        return txObj;
    });

    return res.status(HTTPSTATUS.OK).json({
        message: "All transactions fetched successfully",
        data: maskedTransactions
    });
});

export const getAdminAnalyticsController = asyncHandler(async (req, res) => {
    const last30Days = subDays(new Date(), 30);

    // 1. User Growth (Last 30 days)
    const userGrowth = await UserModel.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 2. Revenue Trends (Last 30 days)
    const revenueTrends = await TransactionModel.aggregate([
        { $match: { date: { $gte: last30Days } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                income: {
                    $sum: { $cond: [{ $eq: ["$type", TransactionTypeEnum.INCOME] }, "$amount", 0] }
                },
                expenses: {
                    $sum: { $cond: [{ $eq: ["$type", TransactionTypeEnum.EXPENSE] }, "$amount", 0] }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    return res.status(HTTPSTATUS.OK).json({
        message: "Admin analytics fetched successfully",
        data: {
            userGrowth: userGrowth.map(d => ({ date: d._id, count: d.count })),
            revenueTrends: revenueTrends.map(d => ({
                date: d._id,
                income: convertToDollarUnit(d.income),
                expenses: convertToDollarUnit(d.expenses)
            }))
        }
    });
});
