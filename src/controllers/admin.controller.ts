import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";
import * as reviewService from "../services/review.service.js";
import * as userService from "../services/user.service.js";
import { successResponse, paginatedResponse } from "../utils/response.util.js";
import { isValidUUID } from "../utils/validation.util.js";
import { ValidationError } from "../utils/error.util.js";
import { CreateProductDto, UpdateProductDto } from "../types/product.types.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../config/constants.js";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data: CreateProductDto = req.body;
    const imageFile = req.file;

    const product = await productService.createProduct(data, imageFile);

    return successResponse(res, "Product created successfully", product, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const data: UpdateProductDto = req.body;
    const imageFile = req.file;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid product ID");
    }

    const product = await productService.updateProduct(id, data, imageFile);

    return successResponse(res, "Product updated successfully", product);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid product ID");
    }

    await productService.deleteProduct(id);

    return successResponse(res, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
}

export async function getAllProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    const { products, total } = await productService.getAllProducts(
      page,
      limit
    );

    const totalPages = Math.ceil(total / limit);

    return paginatedResponse(
      res,
      products,
      { page, limit, total, totalPages },
      "Products retrieved successfully"
    );
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

    await reviewService.deleteReview(id, req.user!.userId, true);

    return successResponse(res, "Review deleted successfully");
  } catch (error) {
    next(error);
  }
}

export async function banUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid user ID");
    }

    await userService.banUser(id);

    return successResponse(res, "User banned successfully");
  } catch (error) {
    next(error);
  }
}

export async function unbanUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid user ID");
    }

    await userService.unbanUser(id);

    return successResponse(res, "User unbanned successfully");
  } catch (error) {
    next(error);
  }
}
