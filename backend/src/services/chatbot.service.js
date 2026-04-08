import mongoose from "mongoose";
import { format, subDays } from "date-fns";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import { convertToDollarUnit, formatCurrency } from "../utils/format-currency.js";
import { genAI, genAIModel } from "../config/google-ai.config.js";
import { getChatbotSystemPrompt } from "../utils/prompt.js";
import { createTransactionService } from "./transaction.service.js";
import { setBudgetService } from "./budget.service.js";
import { createGoalService } from "./goal.service.js";

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

/**
 * Executes a specific financial task based on AI detection
 */
const executeAiAction = async (userId, action) => {
  if (!action || !action.type || !action.data) return null;

  try {
    switch (action.type) {
      case "ADD_TRANSACTION":
        return await createTransactionService(action.data, userId);
      case "SET_BUDGET":
        return await setBudgetService(userId, action.data);
      case "CREATE_GOAL":
        return await createGoalService(userId, action.data);
      default:
        console.warn(`Unknown AI action type: ${action.type}`);
        return null;
    }
  } catch (error) {
    console.error(`AI Action Execution Error (${action.type}):`, error);
    throw error;
  }
};

export const chatbotService = async (userId, message, conversationHistory = []) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(`Invalid User ID: ${userId}`);
    }

    const financialContext = await getChatContext(userId);
    const systemMessage = getChatbotSystemPrompt(financialContext);

    const contents = [];
    const history = conversationHistory.slice(-10);
    const firstUserText = history.length > 0 ? history[0].content : message;

    contents.push({
      role: "user",
      parts: [{ text: `${systemMessage}\n\nClient Initial Request: ${firstUserText}` }]
    });

    for (let i = 1; i < history.length; i++) {
      const msg = history[i];
      const role = msg.role === "user" ? "user" : "model";
      const lastRole = contents[contents.length - 1].role;

      if (role === lastRole) {
        contents[contents.length - 1].parts[0].text += "\n" + msg.content;
      } else {
        contents.push({ role, parts: [{ text: msg.content }] });
      }
    }

    if (history.length > 0) {
      const lastRole = contents[contents.length - 1].role;
      if (lastRole === "user") {
        contents[contents.length - 1].parts[0].text += "\n" + message;
      } else {
        contents.push({ role: "user", parts: [{ text: message }] });
      }
    }

    const responseSchema = {
      type: "object",
      properties: {
        reply: { type: "string" },
        action: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["ADD_TRANSACTION", "SET_BUDGET", "CREATE_GOAL"] },
            data: { type: "object" }
          }
        }
      },
      required: ["reply"]
    };

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const rawResponse = result?.text || 
                        result?.response?.text?.() || 
                        result?.candidates?.[0]?.content?.parts?.[0]?.text || 
                        "{}";

    let aiData;
    try {
      // Robust cleaning: remove markdown blocks and leading/trailing non-JSON text
      const cleaned = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^[^{]*/, "") // Remove anything before first '{'
        .replace(/[^}]*$/, "") // Remove anything after last '}'
        .trim();
        
      aiData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Gemini JSON Parsing Error:", parseError, "Raw Response:", rawResponse);
      // Last-ditch effort: if it looks like it was truncated but we have a partial reply string
      const replyMatch = rawResponse.match(/"reply":\s*"([^"]*)"/);
      aiData = { 
        reply: replyMatch ? replyMatch[1] : (rawResponse.substring(0, 200) + "..."),
        action: null 
      };
    }

    let actionResult = null;
    let finalReply = aiData.reply;

    if (aiData.action) {
      try {
        actionResult = await executeAiAction(userId, aiData.action);
      } catch (actionError) {
        finalReply = `I tried to perform that action, but ran into an issue: ${actionError.message}. Please check your input and try again.`;
      }
    }

    return {
      reply: finalReply?.trim() || "I've processed your request.",
      actionPerformed: !!actionResult,
      actionDetails: aiData.action,
    };
  } catch (error) {
    console.error("Chatbot Service Error:", error);
    return {
      reply: "Sorry, I am having trouble connecting. Please try again.",
    };
  }
};
