import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { suggestCategoryService } from "../services/categorize.service.js";

export const suggestCategoryController = asyncHandler(async (req, res) => {
  if (!req.body) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Request body is missing",
    });
  }

  const { title, type } = req.body;

  if (!title || typeof title !== "string" || title.length < 2) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      message: "Title must be a string with at least 2 characters",
    });
  }

  const result = await suggestCategoryService(title, type || "EXPENSE");

  return res.status(HTTPSTATUS.OK).json({
    message: "Category suggested",
    data: result,
  });
});
