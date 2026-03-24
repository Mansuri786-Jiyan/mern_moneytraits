import { Router } from "express";
import { getAllReportsController, generateReportController, updateReportSettingController, emailReportController } from "../controllers/report.controller.js";

const reportRoutes = Router();

reportRoutes.get("/all", getAllReportsController);
reportRoutes.get("/generate", generateReportController);
reportRoutes.post("/update-setting", updateReportSettingController);
reportRoutes.post("/email", emailReportController);

export default reportRoutes;
