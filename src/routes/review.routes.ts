import { Router } from "express";
import * as reviewController from "../controllers/review.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, reviewController.getMyReviews);
router.post("/:productId", authenticate, reviewController.createReview);
router.get("/:productId", reviewController.getProductReviews);
router.put("/:id", authenticate, reviewController.updateReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
