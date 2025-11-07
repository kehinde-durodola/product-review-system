import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authenticate, userController.getProfile);
router.patch("/profile", authenticate, userController.updateProfile);
router.patch("/password", authenticate, userController.updatePassword);

export default router;
