import { Request, Response, NextFunction } from "express";
import * as productService from "../services/product.service.js";
import { successResponse, paginatedResponse } from "../utils/response.util.js";
import { isValidUUID } from "../utils/validation.util.js";
import { ValidationError } from "../utils/error.util.js";
import { DEFAULT_PAGE, DEFAULT_LIMIT } from "../config/constants.js";

export async function getProducts(
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

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      throw new ValidationError("Invalid product ID");
    }

    const product = await productService.getProductById(id);

    return successResponse(res, "Product retrieved successfully", product);
  } catch (error) {
    next(error);
  }
}

export async function getProductsByCategory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    const { products, total } = await productService.getProductsByCategory(
      category,
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

export async function searchProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
    const limit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;

    if (!query) {
      throw new ValidationError("Search query is required");
    }

    const { products, total } = await productService.searchProducts(
      query,
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
