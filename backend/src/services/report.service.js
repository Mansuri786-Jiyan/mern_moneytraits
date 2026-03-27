import mongoose from "mongoose";
import ReportSettingModel from "../models/report-setting.model.js";
import ReportModel from "../models/report.model.js";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import { NotFoundException } from "../utils/app-error.js";
import { calulateNextReportDate } from "../utils/helper.js";
import { convertToDollarUnit } from "../utils/format-currency.js";
import { format } from "date-fns";
import { genAI, genAIModel } from "../config/google-ai.config.js";
import { createUserContent } from "@google/genai";
import { reportInsightPrompt } from "../utils/prompt.js";

export const getAllReportsService = async (userId, pagination) => {
    const query = { userId };
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;
    const [reports, totalCount] = await Promise.all([
        ReportModel.find(query).skip(skip).limit(pageSize).sort({ createdAt: -1 }),
        ReportModel.countDocuments(query),
    ]);
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        reports,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        },
    };
};

export const updateReportSettingService = async (userId, body) => {
    const { isEnabled } = body;
    let nextReportDate = null;
    const existingReportSetting = await ReportSettingModel.findOne({
        userId,
    });
    if (!existingReportSetting)
        throw new NotFoundException("Report setting not found");
    if (isEnabled) {
        const currentNextReportDate = existingReportSetting.nextReportDate;
        const now = new Date();
        if (!currentNextReportDate || currentNextReportDate <= now) {
            nextReportDate = calulateNextReportDate(existingReportSetting.lastSentDate);
        }
        else {
            nextReportDate = currentNextReportDate;
        }
    }
    existingReportSetting.set({
        ...body,
        nextReportDate,
    });
    await existingReportSetting.save();
};

export const generateReportService = async (userId, fromDate, toDate) => {
    const results = await TransactionModel.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId),
                date: { $gte: fromDate, $lte: toDate },
            },
        },
        {
            $facet: {
                summary: [
                    {
                        $group: {
                            _id: null,
                            totalIncome: {
                                $sum: {
                                    $cond: [
                                        { $eq: ["$type", TransactionTypeEnum.INCOME] },
                                        { $abs: "$amount" },
                                        0,
                                    ],
                                },
                            },
                            totalExpenses: {
                                $sum: {
                                    $cond: [
                                        { $eq: ["$type", TransactionTypeEnum.EXPENSE] },
                                        { $abs: "$amount" },
                                        0,
                                    ],
                                },
                            },
                        },
                    },
                ],
                categories: [
                    {
                        $match: { type: TransactionTypeEnum.EXPENSE },
                    },
                    {
                        $group: {
                            _id: "$category",
                            total: { $sum: { $abs: "$amount" } },
                        },
                    },
                    {
                        $sort: { total: -1 },
                    },
                    {
                        $limit: 5,
                    },
                ],
                transactions: [
                    {
                        $sort: { date: -1 },
                    },
                ],
            },
        },
        {
            $project: {
                totalIncome: {
                    $arrayElemAt: ["$summary.totalIncome", 0],
                },
                totalExpenses: {
                    $arrayElemAt: ["$summary.totalExpenses", 0],
                },
                categories: 1,
                transactions: 1,
            },
        },
    ]);
    if (!results?.length ||
        (results[0]?.totalIncome === 0 && results[0]?.totalExpenses === 0))
        return null;
    const { totalIncome = 0, totalExpenses = 0, categories = [], transactions = [] } = results[0] || {};
    const byCategory = categories.reduce((acc, { _id, total }) => {
        acc[_id] = {
            amount: convertToDollarUnit(total),
            percentage: totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0,
        };
        return acc;
    }, {});
    const availableBalance = totalIncome - totalExpenses;
    const savingsRate = calculateSavingRate(totalIncome, totalExpenses);
    const periodLabel = `${format(fromDate, "MMMM d")} - ${format(toDate, "d, yyyy")}`;
    const insights = await generateInsightsAI({
        totalIncome,
        totalExpenses,
        availableBalance,
        savingsRate,
        categories: byCategory,
        periodLabel: periodLabel,
    });
    return {
        period: periodLabel,
        summary: {
            income: convertToDollarUnit(totalIncome),
            expenses: convertToDollarUnit(totalExpenses),
            balance: convertToDollarUnit(availableBalance),
            savingsRate: Number(savingsRate.toFixed(1)),
            topCategories: Object.entries(byCategory)?.map(([name, cat]) => ({
                name,
                amount: cat.amount,
                percent: cat.percentage,
            })),
        },
        insights,
    };
};

async function generateInsightsAI({ totalIncome, totalExpenses, availableBalance, savingsRate, categories, periodLabel, }) {
    try {
        const prompt = reportInsightPrompt({
            totalIncome: convertToDollarUnit(totalIncome),
            totalExpenses: convertToDollarUnit(totalExpenses),
            availableBalance: convertToDollarUnit(availableBalance),
            savingsRate: Number(savingsRate.toFixed(1)),
            categories,
            periodLabel,
        });

        // 1. Call Gemini using existing genAI and genAIModel
        const result = await genAI.models.generateContent({
            model: genAIModel,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                temperature: 0.4,
            },
        });

        // 2. Safely extract response text using multiple fallback paths
        const text = result?.text || 
                     result?.response?.text?.() || 
                     result?.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "";

        // 3. Fallback handling if no text exists
        if (!text || text.trim().length < 5) {
            return ["Unable to generate insights at the moment"];
        }

        // 4. Parse output into array: split by newline + remove bullets
        const insights = text
            .split("\n")
            .map(line => line.replace(/^[•\s*-]+/, "").trim())
            .filter(Boolean)
            .filter(line => line.length > 5);

        return insights.length > 0 ? insights.slice(0, 5) : ["Unable to generate insights at the moment"];
    }
    catch (error) {
        // 5. Catch error, log it, and return safe fallback
        console.error("AI Insights Generation Error:", error);
        return ["AI insights unavailable"];
    }
}
function calculateSavingRate(totalIncome, totalExpenses) {
    if (totalIncome <= 0)
        return 0;
    const savingRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    return parseFloat(savingRate.toFixed(2));
}
