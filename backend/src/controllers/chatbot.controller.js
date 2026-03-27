import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { chatbotService } from "../services/chatbot.service.js";

export const chatbotController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { message, conversationHistory = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 500) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Invalid message. It must be between 1 and 500 characters.",
    });
  }

  if (!userId) {
    return res.status(HTTPSTATUS.UNAUTHORIZED).json({
      message: "Unauthorized. Please log in to use the chatbot.",
    });
  }

  const result = await chatbotService(userId, message.trim(), conversationHistory);

  return res.status(HTTPSTATUS.OK).json({
    message: "OK",
    data: result,
  });
});
