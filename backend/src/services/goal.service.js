import GoalModel from "../models/goal.model.js";
import { NotFoundException } from "../utils/app-error.js";

export const createGoalService = async (userId, data) => {
  const goal = await GoalModel.create({
    userId,
    ...data,
  });
  return goal;
};

export const getAllGoalsService = async (userId) => {
  const goals = await GoalModel.find({ userId }).sort({ createdAt: -1 });
  return goals;
};

export const updateGoalService = async (goalId, userId, data) => {
  const goal = await GoalModel.findOneAndUpdate(
    { _id: goalId, userId },
    { $set: data },
    { new: true }
  );

  if (!goal) {
    throw new NotFoundException("Goal not found");
  }

  // Auto-complete if current meets target
  if (goal.currentAmount >= goal.targetAmount && goal.status !== "COMPLETED") {
    goal.status = "COMPLETED";
    await goal.save();
  }

  return goal;
};

export const deleteGoalService = async (goalId, userId) => {
  const goal = await GoalModel.findOneAndDelete({ _id: goalId, userId });
  if (!goal) {
    throw new NotFoundException("Goal not found");
  }
  return goal;
};
