import { Router } from "express";
import {
  createGoalController,
  getAllGoalsController,
  updateGoalController,
  deleteGoalController,
} from "../controllers/goal.controller.js";

const goalRoutes = Router();

goalRoutes.post("/create", createGoalController);
goalRoutes.get("/all", getAllGoalsController);
goalRoutes.patch("/update/:id", updateGoalController);
goalRoutes.delete("/delete/:id", deleteGoalController);

export default goalRoutes;
