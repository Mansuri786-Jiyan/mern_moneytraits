import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getAllReportsService, updateReportSettingService, generateReportService } from "../services/report.service.js";
import { updateReportSettingSchema } from "../validators/report.validator.js";
import { sendEmail } from "../mailers/mailer.js";
import { getReportEmailTemplate } from "../mailers/templates/report.template.js";

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
    const userId = req.user?._id;
    const { from, to } = req.query;
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const result = await generateReportService(userId, fromDate, toDate);
    return res.status(HTTPSTATUS.OK).json({
        message: "Report generated successfully",
        ...result,
    });
});

export const emailReportController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { from, to } = req.body;
    
    if (!from || !to) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "From and To dates are required" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);
    
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
