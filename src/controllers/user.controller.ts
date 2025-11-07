import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import { successResponse } from "../utils/response.util.js";
import { isValidEmail } from "../utils/validation.util.js";
import { ValidationError } from "../utils/error.util.js";
import { UpdateUserDto, UpdatePasswordDto } from "../types/user.types.js";

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getUserProfile(req.user!.userId);

    return successResponse(res, "Profile retrieved successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data: UpdateUserDto = req.body;

    if (data.email && !isValidEmail(data.email)) {
      throw new ValidationError("Invalid email address");
    }

    if (data.name && data.name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters");
    }

    const user = await userService.updateProfile(req.user!.userId, data);

    return successResponse(res, "Profile updated successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data: UpdatePasswordDto = req.body;

    if (!data.currentPassword) {
      throw new ValidationError("Current password is required");
    }

    if (!data.newPassword || data.newPassword.length < 8) {
      throw new ValidationError("New password must be at least 8 characters");
    }

    await userService.updatePassword(req.user!.userId, data);

    return successResponse(
      res,
      "Password updated successfully. Please login again."
    );
  } catch (error) {
    next(error);
  }
}
