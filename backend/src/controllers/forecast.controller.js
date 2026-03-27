import { asyncHandler } from "../middlewares/asyncHandler.middlerware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { generateForecastService } from "../services/forecast.service.js";

export const getForecastController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const result = await generateForecastService(userId);

  return res.status(HTTPSTATUS.OK).json({
    message: "Forecast generated successfully",
    data: result,
  });
});
