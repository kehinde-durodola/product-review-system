import { Response } from "express";
import {
  ApiResponse,
  ErrorResponse,
  PaginationMeta,
} from "../types/common.types.js";

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  return res.status(statusCode).json(response);
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: Array<{ field: string; message: string }>
): Response {
  const response: ErrorResponse = {
    success: false,
    message,
    errors,
  };

  return res.status(statusCode).json(response);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  message: string = "Data retrieved successfully"
): Response {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
}
