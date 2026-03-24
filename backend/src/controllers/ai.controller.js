import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { generateFinancialAdviceService } from "../services/ai.service.js";
import TransactionModel from "../models/transaction.model.js";

export const getFinancialAdviceController = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            success: false,
            message: "User message is required",
        });
    }

    // Fetch transactions from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await TransactionModel.find({
        userId,
        date: { $gte: thirtyDaysAgo }
    })
    .select("title amount category type date")
    .sort({ date: -1 })
    .lean();

    // Construct Context (Data Minimization: No full names or raw credentials)
    let context = "Transactions last 30 days:\n";
    if (transactions.length === 0) {
        context += "No transactions found in this period.";
    } else {
        const income = transactions.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
        
        context += `Total Income (30 days): ₹${income}\n`;
        context += `Total Expenses (30 days): ₹${expenses}\n\n`;
        context += "Recent Transactions:\n";
        
        // Limit to 50 transactions to save token costs and avoid context limit
        transactions.slice(0, 50).forEach(t => {
            const date = new Date(t.date).toISOString().split('T')[0];
            context += `- ${date}: ${t.title} (₹${t.amount}, ${t.category}, ${t.type})\n`;
        });
    }

    // Get Advice from Gemini
    const advice = await generateFinancialAdviceService(context, message);

    return res.status(HTTPSTATUS.OK).json({
        success: true,
        data: {
            advice
        }
    });
});
