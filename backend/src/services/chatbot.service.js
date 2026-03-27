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
    // 0. Quick validation of userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid User ID: ${userId}`);
    }

    const financialContext = await getChatContext(userId);
    const systemMessage = getChatbotSystemPrompt(financialContext);

    // 1. Build contents array with alternating roles
    // Gemini REQUIRES alternating user/model/user roles.
    const contents = [];

    // The first message will contain our system prompt + the first historical message (or current message)
    const history = conversationHistory.slice(-10);
    
    // Initial message from user (augmented with system context)
    const firstUserText = history.length > 0 ? history[0].content : message;
    contents.push({
      role: "user",
      parts: [{ text: `${systemMessage}\n\nClient Initial Request: ${firstUserText}` }]
    });

    // Add subsequent history, alternating roles
    for (let i = 1; i < history.length; i++) {
      const msg = history[i];
      const role = msg.role === "user" ? "user" : "model";
      
      // Safety: Prevent consecutive identical roles
      const lastRole = contents[contents.length - 1].role;
      if (role === lastRole) {
        // If consecutive same role, combine them into one message if possible, or skip
        contents[contents.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current message IF it wasn't the very first one we used above
    if (history.length > 0) {
      const lastRole = contents[contents.length - 1].role;
      if (lastRole === "user") {
        contents[contents.length - 1].parts[0].text += "\n" + message;
      } else {
        contents.push({
          role: "user",
          parts: [{ text: message }],
        });
      }
    }

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 400,
      },
    });

    // 2. Defensive extraction (mirroring report.service.js)
    const reply = result?.text || 
                  result?.response?.text?.() || 
                  result?.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "I could not process that. Please try again.";

    return {
      reply: reply.trim(),
    };
  } catch (error) {
    console.error("Chatbot Service Error:", error);
    return {
      reply: "Sorry, I am having trouble connecting. Please try again.",
    };
  }
};
