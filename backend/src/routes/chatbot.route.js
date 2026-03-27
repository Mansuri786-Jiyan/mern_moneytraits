import { Router } from "express";
import { chatbotController } from "../controllers/chatbot.controller.js";

const chatbotRoutes = Router();

chatbotRoutes.post("/message", chatbotController);

export default chatbotRoutes;
