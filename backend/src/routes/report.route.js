import { Router } from "express";
import { getAllReportsController, generateReportController, updateReportSettingController } from "../controllers/report.controller.js";

const reportRoutes = Router();

reportRoutes.get("/all", getAllReportsController);
reportRoutes.get("/generate", generateReportController);
reportRoutes.put("/update-setting", updateReportSettingController);

export default reportRoutes;
