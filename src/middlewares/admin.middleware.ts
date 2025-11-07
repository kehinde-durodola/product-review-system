import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../utils/error.util.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new UnauthorizedError("Authentication required"));
  }

  if (req.user.role !== "ADMIN") {
    return next(new ForbiddenError("Admin access required"));
  }

  next();
}
