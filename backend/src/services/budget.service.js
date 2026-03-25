import mongoose from "mongoose";
import BudgetModel from "../models/budget.model.js";
import TransactionModel, { TransactionTypeEnum } from "../models/transaction.model.js";
import { NotFoundException } from "../utils/app-error.js";

export const setBudgetService = async (userId, body) => {
  const { category, limitAmount } = body;
  const month = body.month || new Date().getMonth() + 1;
  const year = body.year || new Date().getFullYear();

  const budget = await BudgetModel.findOneAndUpdate(
    { userId, category, month, year },
    { limitAmount },
    { upsert: true, new: true }
  );

  return budget;
};

export const getAllBudgetsService = async (userId, month, year) => {
  const budgets = await BudgetModel.find({ userId, month, year }).lean();

  // Calculate start and end of month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);

  // Aggregate expenses by category for the month
  const expenses = await TransactionModel.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        type: TransactionTypeEnum.EXPENSE,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: "$category",
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  const expenseMap = expenses.reduce((acc, curr) => {
    // Convert cents back to original unit
    acc[curr._id] = curr.totalSpent / 100;
    return acc;
  }, {});

  const enrichedBudgets = budgets.map((b) => {
    const spent = expenseMap[b.category] || 0;
    const remaining = Math.max(0, b.limitAmount - spent);
    const percentage = b.limitAmount > 0 ? Math.round((spent / b.limitAmount) * 100) : 0;
    
    return {
      ...b,
      spent,
      remaining,
      percentage,
      isOverBudget: spent > b.limitAmount,
    };
  });

  const summary = enrichedBudgets.reduce(
    (acc, curr) => {
      acc.totalBudgeted += curr.limitAmount;
      acc.totalSpent += curr.spent;
      acc.totalRemaining += curr.remaining;
      if (curr.isOverBudget) acc.budgetsOverLimit += 1;
      return acc;
    },
    { totalBudgeted: 0, totalSpent: 0, totalRemaining: 0, budgetsOverLimit: 0 }
  );

  return {
    budgets: enrichedBudgets,
    summary,
    month,
    year,
  };
};

export const deleteBudgetService = async (userId, id) => {
  const budget = await BudgetModel.findOneAndDelete({ _id: id, userId });
  if (!budget) throw new NotFoundException("Budget not found");
  return budget;
};

export const getBudgetSummaryService = async (userId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const data = await getAllBudgetsService(userId, month, year);
  return {
    summary: data.summary,
    month,
    year,
  };
};
