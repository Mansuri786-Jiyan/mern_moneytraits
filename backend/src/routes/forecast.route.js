import { Router } from "express";
import { getForecastController } from "../controllers/forecast.controller.js";

const forecastRoutes = Router();

forecastRoutes.get("/generate", getForecastController);

export default forecastRoutes;
