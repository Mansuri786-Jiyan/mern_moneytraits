import { Router } from "express";
import {
  setBudgetController,
  getAllBudgetsController,
  deleteBudgetController,
  getBudgetSummaryController,
} from "../controllers/budget.controller.js";

const budgetRoutes = Router();

budgetRoutes.post("/set", setBudgetController);
budgetRoutes.get("/all", getAllBudgetsController);
budgetRoutes.get("/summary", getBudgetSummaryController);
budgetRoutes.delete("/delete/:id", deleteBudgetController);

export default budgetRoutes;
