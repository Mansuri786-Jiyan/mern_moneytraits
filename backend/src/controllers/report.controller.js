import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getAllReportsService, updateReportSettingService, generateReportService } from "../services/report.service.js";
import { updateReportSettingSchema } from "../validators/report.validator.js";
import { sendEmail } from "../mailers/mailer.js";
import { getReportEmailTemplate } from "../mailers/templates/report.template.js";
import UserModel from "../models/user.model.js";
import ReportModel, { ReportStatusEnum } from "../models/report.model.js";
import { sendReportEmail } from "../mailers/report.mailer.js";
import { BadRequestException } from "../utils/app-error.js";

export const getAllReportsController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const pagination = {
        pageSize: parseInt(req.query.pageSize) || 20,
        pageNumber: parseInt(req.query.pageNumber) || 1,
    };
    const result = await getAllReportsService(userId, pagination);
    return res.status(HTTPSTATUS.OK).json({
        message: "Reports history fetched successfully",
        ...result,
    });
});

export const updateReportSettingController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const body = updateReportSettingSchema.parse(req.body);
    await updateReportSettingService(userId, body);
    return res.status(HTTPSTATUS.OK).json({
        message: "Reports setting updated successfully",
    });
});

export const generateReportController = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const { from, to } = req.query;

        if (!from || !to) {
            return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "From and To dates are required" });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        const result = await generateReportService(userId, fromDate, toDate);

        if (!result) {
            return res.status(HTTPSTATUS.NOT_FOUND).json({
                message: "No transactions found for this period",
            });
        }

        return res.status(HTTPSTATUS.OK).json({
            message: "Report generated successfully",
            ...result,
        });
    } catch (error) {
        console.error("Error in generateReportController:", error);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while generating the report. Please try again later.",
        });
    }
});

export const emailReportController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { from, to } = req.body;
    
    if (!from || !to) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "From and To dates are required" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid date format provided." });
    }
    
    const result = await generateReportService(userId, fromDate, toDate);

    if (!result) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "No transactions found for the complete period to generate an email report."
        });
    }

    if (!req.user?.email) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "User email not found. Please update your profile." });
    }

    const reportData = {
        username: req.user.name || "User",
        period: result.period,
        totalIncome: result.summary.income,
        totalExpenses: result.summary.expenses,
        availableBalance: result.summary.balance,
        savingsRate: result.summary.savingsRate,
        topSpendingCategories: result.summary.topCategories,
        insights: result.insights,
        transactions: result.transactions,
    };

    const emailTemplate = getReportEmailTemplate(reportData, "Custom Date Range");

    try {
        await sendEmail({
            to: req.user.email,
            subject: `Your Financial Report for ${result.period}`,
            html: emailTemplate,
        });

        return res.status(HTTPSTATUS.OK).json({
            message: "Report emailed successfully",
        });
    }
    catch (error) {
        console.error("Error in emailReportController:", error);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to send email. Please check your SMTP settings.",
        });
    }
});

export const sendReportNowController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { from, to } = req.query;

    if (!from || !to) {
        throw new BadRequestException("From and To dates are required");
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    const user = await UserModel.findById(userId);
    const result = await generateReportService(userId, fromDate, toDate);

    if (!result) {
        return res.status(HTTPSTATUS.NOT_FOUND).json({
            message: "No transactions found for this period",
        });
    }

    try {
        await sendReportEmail({
            email: user.email,
            username: user.name,
            report: {
                period: result.period,
                totalIncome: result.summary.income,
                totalExpenses: result.summary.expenses,
                availableBalance: result.summary.balance,
                savingsRate: result.summary.savingsRate,
                topSpendingCategories: result.summary.topCategories,
                insights: result.insights,
            },
            frequency: "custom",
        });

        await ReportModel.create({
            userId,
            period: result.period,
            sentDate: new Date(),
            status: ReportStatusEnum.SENT,
        });

        return res.status(HTTPSTATUS.OK).json({
            message: "Report sent to your email successfully",
            data: result
        });
    } catch (error) {
        console.error("Error sending report now:", error);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            message: "Failed to send report",
        });
    }
});
