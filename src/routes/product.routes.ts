import { Router } from "express";
import * as productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/category/:category", productController.getProductsByCategory);
router.get("/:id", productController.getProductById);

export default router;
