import mongoose from "mongoose";
import { subMonths, startOfMonth, endOfMonth, format, subDays } from "date-fns";
import { createUserContent } from "@google/genai";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import { convertToDollarUnit, formatCurrency } from "../utils/format-currency.js";
import { genAI, genAIModel } from "../config/google-ai.config.js";
import { getChatbotSystemPrompt } from "../utils/prompt.js";

const getChatContext = async (userId) => {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  // 1. Fetch 30-day summary (Income, Expenses, Balance)
  const summaryAggregation = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        date: { $gte: thirtyDaysAgo, $lte: now },
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", TransactionTypeEnum.INCOME] }, { $abs: "$amount" }, 0],
          },
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ["$type", TransactionTypeEnum.EXPENSE] }, { $abs: "$amount" }, 0],
          },
        },
      },
    },
  ]);

  const summary = summaryAggregation[0] || { totalIncome: 0, totalExpenses: 0 };
  const income = convertToDollarUnit(summary.totalIncome);
  const expenses = convertToDollarUnit(summary.totalExpenses);
  const balance = income - expenses;

  // 2. Fetch Top 5 Spending Categories
  const categoryAggregation = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: TransactionTypeEnum.EXPENSE,
        date: { $gte: thirtyDaysAgo, $lte: now },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: { $abs: "$amount" } },
      },
    },
    { $sort: { total: -1 } },
    { $limit: 5 },
  ]);

  const categoriesString = categoryAggregation
    .map((c) => `${c._id}: ${formatCurrency(convertToDollarUnit(c.total))}`)
    .join(", ") || "None";

  // 3. Fetch Last 5 Transactions
  const recentTransactions = await TransactionModel.find({ userId })
    .sort({ date: -1 })
    .limit(5)
    .lean();

  const transactionsString = recentTransactions
    .map(
      (t) =>
        `- ${t.title}: ${formatCurrency(convertToDollarUnit(t.amount))} (${t.category}) on ${format(
          t.date,
          "MMM dd"
        )}`
    )
    .join("\n") || "No recent transactions found.";

  return `
User's financial context (last 30 days):
- Total income: ${formatCurrency(income)}
- Total expenses: ${formatCurrency(expenses)}
- Available balance: ${formatCurrency(balance)}
- Top spending categories: ${categoriesString}
- Recent transactions:
${transactionsString}
  `;
};

export const chatbotService = async (userId, message, conversationHistory = []) => {
  try {
    const financialContext = await getChatContext(userId);
    const systemMessage = getChatbotSystemPrompt(financialContext);

    // Limit history to last 10 messages
    const history = conversationHistory.slice(-10);

    // Build Gemini contents array
    // First message must be "user" or "system" (if supported). 
    // Here we wrap the system context into the first user message or a specialized system instruction.
    // The user requested: role is "user" or "model"

    const contents = [
      {
        role: "user",
        parts: [{ text: systemMessage + "\n\nUser: " + (history[0]?.content || message) }],
      },
      ...history.slice(1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
    ];

    // If history was empty, the first message already contains the current 'message'.
    // If history was not empty, we need to add the current 'message' at the end.
    if (history.length > 0) {
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });
    }

    const result = await genAI.getGenerativeModel({ model: genAIModel }).generateContent({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    });

    return {
      reply: result.response.text()?.trim() || "I could not process that. Please try again.",
    };
  } catch (error) {
    console.error("Chatbot Service Error:", error);
    return {
      reply: "Sorry, I am having trouble connecting. Please try again.",
    };
  }
};
