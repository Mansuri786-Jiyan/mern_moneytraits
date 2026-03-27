import mongoose from "mongoose";
import { subMonths, startOfMonth, endOfMonth, format, addMonths } from "date-fns";
import { createUserContent } from "@google/genai";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import BudgetModel from "../models/budget.model.js";
import { convertToDollarUnit } from "../utils/format-currency.js";
import { genAI, genAIModel } from "../config/google-ai.config.js";
import { getSpendingForecastPrompt } from "../utils/prompt.js";

export const generateForecastService = async (userId) => {
  try {
    const now = new Date();
    const monthlyHistory = [];
    const categoryStats = {};

    // Step 1: Fetch last 6 months of expense data
    for (let i = 0; i < 6; i++) {
      const from = startOfMonth(subMonths(now, i));
      const to = endOfMonth(subMonths(now, i));

      const aggregation = await TransactionModel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            type: TransactionTypeEnum.EXPENSE,
            date: { $gte: from, $lte: to },
          },
        },
        {
          $group: {
            _id: "$category",
            total: { $sum: { $abs: "$amount" } },
          },
        },
      ]);

      const monthLabel = format(from, "MMM yyyy");
      const monthData = { month: monthLabel, categories: {} };

      aggregation.forEach((item) => {
        const amount = convertToDollarUnit(item.total);
        monthData.categories[item._id] = amount;

        if (!categoryStats[item._id]) {
          categoryStats[item._id] = {
            totals: Array(6).fill(0),
            monthsCount: 0,
          };
        }
        categoryStats[item._id].totals[i] = amount;
        categoryStats[item._id].monthsCount++;
      });

      monthlyHistory.push(monthData);
    }

    // Fetch current budgets for the category warning system
    const currentBudgets = await BudgetModel.find({
      userId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    });

    const budgetMap = {};
    currentBudgets.forEach((b) => {
      budgetMap[b.category] = b.limitAmount;
    });

    const categories = Object.keys(categoryStats);
    if (categories.length === 0) {
      return { predictions: [], totalPredicted: 0 };
    }

    const calculatedPredictions = categories.map((cat) => {
      const stats = categoryStats[cat];
      const validTotals = stats.totals.filter((t) => t > 0);
      const average = validTotals.reduce((a, b) => a + b, 0) / validTotals.length;
      
      // Trend: Last month (index 0) vs Previous month (index 1)
      const lastMonth = stats.totals[0] || 0;
      const prevMonth = stats.totals[1] || 0;
      const trendValue = lastMonth - prevMonth;
      
      const basePrediction = Math.max(0, average + (trendValue * 0.5));
      const trendDir = trendValue > 0 ? "increase" : trendValue < 0 ? "decrease" : "stable";

      return {
        category: cat,
        basePrediction,
        average,
        stats: stats.totals,
        monthsWithData: stats.monthsCount,
        trend: trendDir,
        budgetLimit: budgetMap[cat] || null,
      };
    });

    // Step 2: Handle fallback for users with less than 2 months of data
    const maxMonths = Math.max(...calculatedPredictions.map(p => p.monthsWithData));
    
    if (maxMonths < 2) {
      const finalPredictions = calculatedPredictions.map(p => ({
        category: p.category,
        predicted: p.basePrediction || 0,
        trend: "stable",
        confidence: 40,
        reasoning: "Limited data available. Estimate based on activity.",
        budgetLimit: p.budgetLimit,
      }));

      const totalPredicted = finalPredictions.reduce((sum, p) => sum + p.predicted, 0);
      const lastMonthActual = monthlyHistory[0].categories;
      const totalLastMonth = Object.values(lastMonthActual).reduce((a, b) => a + b, 0);

      return {
        predictions: finalPredictions,
        totalPredicted,
        lastMonthActual: totalLastMonth,
        forecastMonth: format(addMonths(now, 1), "MMMM yyyy"),
        generatedAt: now.toISOString(),
        monthlyHistory: monthlyHistory.reverse(), // For chart: oldest to newest
      };
    }

    // Step 3: Call Gemini AI for refinement (Hybrid Approach)
    const prompt = getSpendingForecastPrompt(monthlyHistory);
    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: { responseMimeType: "application/json" },
    });

    const rawText = result.text;
    const cleanedText = rawText?.replace(/```(?:json)?\n?/g, "").trim();
    
    let aiPredictions = [];
    try {
      aiPredictions = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Gemini parse error in hybrid mode:", parseError);
    }

    // Step 4: Merge AI output with calculations
    const finalPredictions = calculatedPredictions.map((calc) => {
      const ai = aiPredictions.find((p) => p.category === calc.category);
      
      return {
        category: calc.category,
        predicted: ai ? (ai.predicted + calc.basePrediction) / 2 : calc.basePrediction,
        trend: ai ? ai.trend : calc.trend,
        confidence: ai ? ai.confidence : 50,
        reasoning: ai ? ai.reasoning : "Statistical estimate based on recent trends.",
        budgetLimit: calc.budgetLimit,
      };
    }).sort((a, b) => b.predicted - a.predicted);

    const totalPredicted = finalPredictions.reduce((sum, p) => sum + p.predicted, 0);
    const lastMonthActual = monthlyHistory.find(h => h.month === format(now, "MMM yyyy"))?.categories || {};
    const totalLastMonth = Object.values(lastMonthActual).reduce((a, b) => a + Number(b), 0);

    return {
      predictions: finalPredictions,
      totalPredicted,
      lastMonthActual: totalLastMonth,
      forecastMonth: format(addMonths(now, 1), "MMMM yyyy"),
      generatedAt: now.toISOString(),
      monthlyHistory: monthlyHistory.sort((a, b) => {
         // Sort by date correctly for the chart
         return new Date(a.month) - new Date(b.month);
      }),
    };
  } catch (error) {
    console.error("Upgraded forecast service error:", error);
    throw new Error("Forecast generation failed");
  }
};
