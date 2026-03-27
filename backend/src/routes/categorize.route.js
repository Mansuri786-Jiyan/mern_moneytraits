import { Router } from "express";
import { suggestCategoryController } from "../controllers/categorize.controller.js";

const categorizeRoutes = Router();

categorizeRoutes.post("/suggest", suggestCategoryController);

export default categorizeRoutes;
