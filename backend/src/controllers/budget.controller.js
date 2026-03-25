import { HTTPSTATUS } from "../config/http.config.js";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { setBudgetSchema, getBudgetsSchema } from "../validators/budget.validator.js";
import {
  setBudgetService,
  getAllBudgetsService,
  deleteBudgetService,
  getBudgetSummaryService,
} from "../services/budget.service.js";

export const setBudgetController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const body = setBudgetSchema.parse(req.body);
  const budget = await setBudgetService(userId, body);
  return res.status(HTTPSTATUS.OK).json({
    message: "Budget saved successfully",
    budget,
  });
});

export const getAllBudgetsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { month, year } = getBudgetsSchema.parse(req.query);
  const data = await getAllBudgetsService(userId, month, year);
  return res.status(HTTPSTATUS.OK).json(data);
});

export const deleteBudgetController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const id = req.params.id;
  await deleteBudgetService(userId, id);
  return res.status(HTTPSTATUS.OK).json({
    message: "Budget deleted successfully",
  });
});

export const getBudgetSummaryController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const data = await getBudgetSummaryService(userId);
  return res.status(HTTPSTATUS.OK).json({
    data,
  });
});
