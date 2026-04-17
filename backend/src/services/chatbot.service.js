import mongoose from "mongoose";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import BudgetModel from "../models/budget.model.js";
import GoalModel from "../models/goal.model.js";
import { convertToDollarUnit, formatCurrency } from "../utils/format-currency.js";
import { genAI, genAIModel } from "../config/google-ai.config.js";
import { getChatbotSystemPrompt } from "../utils/prompt.js";
import { createTransactionService } from "./transaction.service.js";
import { setBudgetService } from "./budget.service.js";
import { createGoalService } from "./goal.service.js";

const getChatContext = async (userId) => {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

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

  // 2. Fetch Top 5 Spending Categories (last 30 days)
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

  const categoriesString =
    categoryAggregation
      .map((c) => `${c._id}: ${formatCurrency(convertToDollarUnit(c.total))}`)
      .join(", ") || "None";

  // 3. Fetch Last 10 Transactions
  const recentTransactions = await TransactionModel.find({ userId })
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const transactionsString =
    recentTransactions
      .map(
        (t) =>
          `- [${t.type}] ${t.title}: ${formatCurrency(convertToDollarUnit(t.amount))} (${t.category}) on ${format(
            new Date(t.date),
            "MMM dd, yyyy"
          )}`
      )
      .join("\n") || "No recent transactions found.";

  // 4. Fetch current month's budgets
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const budgets = await BudgetModel.find({
    userId,
    month: currentMonth,
    year: currentYear,
  }).lean();

  // Calculate spending per category this month
  const monthlyExpenses = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: TransactionTypeEnum.EXPENSE,
        date: { $gte: monthStart, $lte: monthEnd },
      },
    },
    { $group: { _id: "$category", totalSpent: { $sum: { $abs: "$amount" } } } },
  ]);
  const spentMap = monthlyExpenses.reduce((acc, e) => {
    acc[e._id] = convertToDollarUnit(e.totalSpent);
    return acc;
  }, {});

  const budgetsString =
    budgets.length > 0
      ? budgets
          .map((b) => {
            const spent = spentMap[b.category] || 0;
            const pct = b.limitAmount > 0 ? Math.round((spent / b.limitAmount) * 100) : 0;
            return `- ${b.category}: Limit ${formatCurrency(b.limitAmount)}, Spent ${formatCurrency(spent)} (${pct}%)${spent > b.limitAmount ? " ⚠️ OVER BUDGET" : ""}`;
          })
          .join("\n")
      : "No budgets set for this month.";

  // 5. Fetch active goals
  const goals = await GoalModel.find({ userId, status: "ACTIVE" }).lean();
  const goalsString =
    goals.length > 0
      ? goals
          .map((g) => {
            const pct =
              g.targetAmount > 0
                ? Math.round((g.currentAmount / g.targetAmount) * 100)
                : 0;
            const deadline = g.deadline
              ? format(new Date(g.deadline), "MMM dd, yyyy")
              : "No deadline";
            return `- ${g.name}: Target ${formatCurrency(g.targetAmount)}, Saved ${formatCurrency(g.currentAmount)} (${pct}%), Deadline: ${deadline}`;
          })
          .join("\n")
      : "No active savings goals.";

  return `
User's Financial Data (as of ${format(now, "MMM dd, yyyy")}):

📊 Last 30 Days Summary:
- Total Income: ${formatCurrency(income)}
- Total Expenses: ${formatCurrency(expenses)}
- Net Balance: ${formatCurrency(balance)}
- Top Spending Categories: ${categoriesString}

🧾 Recent Transactions (last 10):
${transactionsString}

💰 This Month's Budgets (${format(now, "MMMM yyyy")}):
${budgetsString}

🎯 Active Savings Goals:
${goalsString}
  `.trim();
};

/**
 * Executes a specific financial task based on AI detection
 */
const executeAiAction = async (userId, action) => {
  if (!action || !action.type || !action.data) return null;

  const d = action.data;

  // Validate required fields before hitting the DB
  if (action.type === "ADD_TRANSACTION") {
    if (!d.title || !d.type || !d.category || !d.amount || isNaN(Number(d.amount))) {
      console.warn("ADD_TRANSACTION skipped — missing required fields:", d);
      return null;
    }
    d.amount = Number(d.amount);
  }

  if (action.type === "SET_BUDGET") {
    if (!d.category || !d.limitAmount || isNaN(Number(d.limitAmount))) {
      console.warn("SET_BUDGET skipped — missing required fields:", d);
      return null;
    }
    d.limitAmount = Number(d.limitAmount);
  }

  if (action.type === "CREATE_GOAL") {
    if (!d.name || !d.targetAmount || isNaN(Number(d.targetAmount))) {
      console.warn("CREATE_GOAL skipped — missing required fields:", d);
      return null;
    }
    d.targetAmount = Number(d.targetAmount);
  }

  try {
    switch (action.type) {
      case "ADD_TRANSACTION":
        return await createTransactionService(d, userId);
      case "SET_BUDGET":
        return await setBudgetService(userId, d);
      case "CREATE_GOAL":
        return await createGoalService(userId, d);
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

    let financialContext;
    try {
      financialContext = await getChatContext(userId);
    } catch (ctxError) {
      console.error("getChatContext failed:", ctxError?.message);
      financialContext = "No financial data available yet. The user may not have added any transactions.";
    }
    const systemPrompt = getChatbotSystemPrompt(financialContext);

    // Build conversation contents for Gemini
    // Gemini requires alternating user/model roles, starting with user
    const contents = [];
    const history = conversationHistory.slice(-10);

    if (history.length === 0) {
      // No history — just send system prompt + current message as single user turn
      contents.push({
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }],
      });
    } else {
      // First turn: system prompt + first history message
      contents.push({
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser: ${history[0].content}` }],
      });

      // Replay conversation history after the first message
      for (let i = 1; i < history.length; i++) {
        const msg = history[i];
        const role = msg.role === "user" ? "user" : "model";
        const lastRole = contents[contents.length - 1].role;

        if (role === lastRole) {
          // Merge consecutive same-role messages (Gemini doesn't allow consecutive same roles)
          contents[contents.length - 1].parts[0].text += "\n" + msg.content;
        } else {
          contents.push({ role, parts: [{ text: msg.content }] });
        }
      }

      // Append current user message
      const lastRole = contents[contents.length - 1].role;
      if (lastRole === "user") {
        contents[contents.length - 1].parts[0].text += "\nUser: " + message;
      } else {
        contents.push({ role: "user", parts: [{ text: message }] });
      }
    }

    // Minimal schema — only 'reply' is required. 'action' is optional.
    // Using a simple schema avoids forcing the AI to always emit an action.
    const responseSchema = {
      type: "object",
      properties: {
        reply: { type: "string" },
        action: { type: "object" },
      },
      required: ["reply"],
    };

    const model = "gemini-3-flash-preview";

    const genConfig = {
      temperature: 0.7,
      maxOutputTokens: 1500,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    };

    let result;
    let lastError;
    let retries = 0;
    const MAX_RETRIES = 2; // Allow 2 retries

    while (retries <= MAX_RETRIES) {
      try {
        result = await genAI.models.generateContent({ model, contents, config: genConfig });
        console.log(`✅ Chatbot using model: ${model}`);
        break; // success
      } catch (err) {
        lastError = err;
        const errMsg = err?.message || "";

        // Handle Hard Daily Quota Exhaustion specifically
        if (errMsg.toLowerCase().includes("daily limit") || errMsg.toLowerCase().includes("exhausted")) {
          console.error("❌ Daily Quota Exhausted for Gemini API.");
          throw new Error("DAILY_QUOTA_EXHAUSTED"); // Handled by outer catch for clean frontend message
        }

        // Handle 429 Rate / Burst Limits
        if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
          retries++;
          if (retries > MAX_RETRIES) {
            console.error("❌ Max retries reached for 429 limits.");
            throw err;
          }
          
          // Smart backoff: look for retry headers/properties, else default 15 seconds
          const retryDelayHeader = err?.response?.headers?.get?.("retry-after") || err?.retryDelay;
          const waitTime = retryDelayHeader ? parseInt(retryDelayHeader, 10) * 1000 : 15000;
          console.warn(`⚠️ Model hit rate limit (429/Burst). Waiting for ${waitTime / 1000} seconds before trying again (Attempt ${retries})...`);
          
          await new Promise((r) => setTimeout(r, waitTime));
          continue;
        } 
        
        // Handle 503 unavailability
        if (errMsg.includes("503") || errMsg.includes("UNAVAILABLE")) {
          retries++;
          if (retries > MAX_RETRIES) throw err;
          console.warn("⚠️ Model unavailable (503). Retrying briefly...");
          await new Promise((r) => setTimeout(r, 2000));
          continue;
        }

        throw err; // non-retryable error (eg 400 Bad Request)
      }
    }

    if (!result) {
      throw lastError || new Error("Gemini API is totally unavailable.");
    }


    const rawResponse =
      result?.text ||
      result?.response?.text?.() ||
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "{}";

    let aiData;
    try {
      const cleaned = rawResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^[^{]*/, "")
        .replace(/[^}]*$/, "")
        .trim();

      aiData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Gemini JSON Parsing Error:", parseError, "Raw:", rawResponse);
      const replyMatch = rawResponse.match(/"reply":\s*"([^"]*)"/);
      aiData = {
        reply: replyMatch ? replyMatch[1] : rawResponse.substring(0, 300),
        action: null,
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
      actionDetails: aiData.action || null,
    };
  } catch (error) {
    console.error("Chatbot Service Error:", error?.message || error);

    const msg = error?.message || "";

    // 1. Check if we hit the hard daily quota
    if (msg.includes("DAILY_QUOTA_EXHAUSTED") || msg.toLowerCase().includes("daily limit")) {
      return {
        reply: "⚠️ The AI assistant has reached its daily usage quota limit. Please try again tomorrow. Your financial processing and dashboards will continue to operate normally.",
      };
    }

    // 2. Detect temporary burst quota / rate-limit / overload errors
    if (msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("rate limit") || msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand")) {
      return {
        reply: "⚠️ The AI assistant is currently experiencing unusually high demand or has hit its temporary API limit. Please wait a few minutes and try again. Your data is perfectly safe.",
      };
    }

    // Detect network / connection errors
    if (msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND") || msg.includes("network")) {
      return {
        reply: "⚠️ I'm having trouble reaching the AI service due to a network issue. Please check your connection and try again.",
      };
    }

    // Generic fallback
    return {
      reply: `⚠️ Something went wrong on my end: ${msg.substring(0, 100)}. Please try again.`,
    };
  }
};
