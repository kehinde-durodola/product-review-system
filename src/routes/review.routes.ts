import { Router } from "express";
import * as reviewController from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/products/:productId/reviews",
  authenticate,
  reviewController.createReview
);
router.get("/me", authenticate, reviewController.getMyReviews);
router.get("/products/:productId/reviews", reviewController.getProductReviews);
router.put("/:id", authenticate, reviewController.updateReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
