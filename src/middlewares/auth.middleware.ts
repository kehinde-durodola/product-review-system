import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { UnauthorizedError } from "../utils/error.util.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid or expired token"));
  }
}
