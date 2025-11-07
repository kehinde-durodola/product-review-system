import { Request, Response, NextFunction } from "express";
import * as reviewService from "../services/review.service.js";
import { successResponse, paginatedResponse } from "../utils/response.util.js";
import { isValidUUID } from "../utils/validation.util.js";
import { ValidationError } from "../utils/error.util.js";
import { CreateReviewDto, UpdateReviewDto } from "../types/review.types.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../config/constants.js";

export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const data: CreateReviewDto = req.body;

    if (!isValidUUID(productId)) {
      throw new ValidationError("Invalid product ID");
    }

    const review = await reviewService.createReview(
      productId,
      req.user!.userId,
      data
    );

    return successResponse(res, "Review created successfully", review, 201);
  } catch (error) {
    next(error);
  }
}

export async function getMyReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    const { reviews, total } = await reviewService.getUserReviews(
      req.user!.userId,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return paginatedResponse(
      res,
      reviews,
      { page, limit, total, totalPages },
      "Reviews retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

export async function getProductReviews(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    if (!isValidUUID(productId)) {
      throw new ValidationError("Invalid product ID");
    }

    const { reviews, total } = await reviewService.getProductReviews(
      productId,
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return paginatedResponse(
      res,
      reviews,
      { page, limit, total, totalPages },
      "Reviews retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
}

export async function updateReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const data: UpdateReviewDto = req.body;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid review ID");
    }

    const review = await reviewService.updateReview(id, req.user!.userId, data);

    return successResponse(res, "Review updated successfully", review);
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid review ID");
    }

    await reviewService.deleteReview(id, req.user!.userId);

    return successResponse(res, "Review deleted successfully");
  } catch (error) {
    next(error);
  }
}
