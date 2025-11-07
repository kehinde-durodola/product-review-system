import { Router } from "express";
import * as adminController from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/products",
  authenticate,
  requireAdmin,
  upload.single("image"),
  adminController.createProduct
);
router.put(
  "/products/:id",
  authenticate,
  requireAdmin,
  upload.single("image"),
  adminController.updateProduct
);
router.delete(
  "/products/:id",
  authenticate,
  requireAdmin,
  adminController.deleteProduct
);
router.get(
  "/products",
  authenticate,
  requireAdmin,
  adminController.getAllProducts
);

router.delete(
  "/reviews/:id",
  authenticate,
  requireAdmin,
  adminController.deleteReview
);

router.patch(
  "/users/:id/ban",
  authenticate,
  requireAdmin,
  adminController.banUser
);
router.patch(
  "/users/:id/unban",
  authenticate,
  requireAdmin,
  adminController.unbanUser
);

export default router;
