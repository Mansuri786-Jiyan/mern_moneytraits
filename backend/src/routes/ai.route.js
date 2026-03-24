import { Router } from "express";
import { getFinancialAdviceController } from "../controllers/ai.controller.js";

const aiRoutes = Router();

aiRoutes.post("/advise", getFinancialAdviceController);

export default aiRoutes;
