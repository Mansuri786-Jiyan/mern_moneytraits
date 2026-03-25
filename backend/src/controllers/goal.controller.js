import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import {
  createGoalService,
  getAllGoalsService,
  updateGoalService,
  deleteGoalService,
} from "../services/goal.service.js";
import { createGoalSchema, updateGoalSchema } from "../validators/goal.validator.js";

export const createGoalController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = createGoalSchema.parse(req.body);

  const goal = await createGoalService(userId, data);
  return res.status(HTTPSTATUS.CREATED).json({
    message: "Goal created successfully",
    data: goal,
  });
});

export const getAllGoalsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const goals = await getAllGoalsService(userId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Goals fetched successfully",
    data: goals,
  });
});

export const updateGoalController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const data = updateGoalSchema.parse(req.body);

  const goal = await updateGoalService(id, userId, data);
  return res.status(HTTPSTATUS.OK).json({
    message: "Goal updated successfully",
    data: goal,
  });
});

export const deleteGoalController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  await deleteGoalService(id, userId);
  return res.status(HTTPSTATUS.OK).json({
    message: "Goal deleted successfully",
  });
});
