import * as reviewRepository from "../repositories/review.repository.js";
import * as productRepository from "../repositories/product.repository.js";
import { isValidRating } from "../utils/validation.util.js";
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from "../utils/error.util.js";
import { CreateReviewDto, UpdateReviewDto } from "../types/review.types.js";

export async function createReview(
  productId: string,
  userId: string,
  data: CreateReviewDto
) {
  const product = await productRepository.findById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (!isValidRating(data.rating)) {
    throw new ValidationError("Rating must be between 1 and 5");
  }

  const existingReview = await reviewRepository.findByUserAndProduct(
    userId,
    productId
  );

  if (existingReview) {
    throw new ValidationError("You have already reviewed this product");
  }

  return await reviewRepository.create({
    content: data.content,
    rating: data.rating,
    userId,
    productId,
  });
}

export async function getReviewById(id: string) {
  const review = await reviewRepository.findById(id);

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  return review;
}

export async function getUserReviews(
  userId: string,
  page: number,
  limit: number
) {
  return await reviewRepository.findByUser(userId, page, limit);
}

export async function getProductReviews(
  productId: string,
  page: number,
  limit: number
) {
  return await reviewRepository.findByProduct(productId, page, limit);
}

export async function updateReview(
  id: string,
  userId: string,
  data: UpdateReviewDto
) {
  const review = await reviewRepository.findById(id);

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (review.user.id !== userId) {
    throw new ForbiddenError("You can only edit your own reviews");
  }

  if (data.rating && !isValidRating(data.rating)) {
    throw new ValidationError("Rating must be between 1 and 5");
  }

  return await reviewRepository.update(id, data);
}

export async function deleteReview(
  id: string,
  userId: string,
  isAdmin: boolean = false
) {
  const review = await reviewRepository.findById(id);

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (!isAdmin && review.user.id !== userId) {
    throw new ForbiddenError("You can only delete your own reviews");
  }

  await reviewRepository.deleteReview(id);
}
