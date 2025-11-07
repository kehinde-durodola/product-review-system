import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/error.util.js";
import logger from "../utils/logger.util.js";
import { env } from "../config/env.js";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error("Error occurred", {
    message: error.message,
    stack: env.NODE_ENV === "development" ? error.stack : undefined,
    url: req.url,
    method: req.method,
  });

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "PrismaClientKnownRequestError") {
    return res.status(400).json({
      success: false,
      message: "Database operation failed",
    });
  }

  if (error.name === "MulterError") {
    if (error.message.includes("File too large")) {
      return res.status(400).json({
        success: false,
        message: "File size exceeds 5MB limit",
      });
    }
  }

  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === "development" ? error.message : "Internal server error",
  });
}
