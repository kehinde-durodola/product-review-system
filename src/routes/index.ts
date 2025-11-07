import { Router } from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import productRoutes from "./product.routes.js";
import reviewRoutes from "./review.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/products", productRoutes);
router.use("/reviews", reviewRoutes);
router.use("/user", userRoutes);

export default router;
