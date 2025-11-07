import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { successResponse } from "../utils/response.util.js";
import { isValidEmail, isValidPassword } from "../utils/validation.util.js";
import { ValidationError } from "../utils/error.util.js";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "../types/auth.types.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name }: RegisterDto = req.body;

    if (!email || !isValidEmail(email)) {
      throw new ValidationError("Invalid email address");
    }

    if (!password || !isValidPassword(password)) {
      throw new ValidationError("Password must be at least 8 characters");
    }

    if (!name || name.trim().length < 2) {
      throw new ValidationError("Name must be at least 2 characters");
    }

    const user = await authService.register({ email, password, name });

    return successResponse(
      res,
      "Registration successful. Please check your email to verify your account.",
      user,
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password }: LoginDto = req.body;

    if (!email || !isValidEmail(email)) {
      throw new ValidationError("Invalid email address");
    }

    if (!password) {
      throw new ValidationError("Password is required");
    }

    const result = await authService.login({ email, password });

    return successResponse(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { refreshToken }: RefreshTokenDto = req.body;

    if (!refreshToken) {
      throw new ValidationError("Refresh token is required");
    }

    const result = await authService.refreshToken(refreshToken);

    return successResponse(res, "Token refreshed successfully", result);
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken }: RefreshTokenDto = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    return successResponse(res, "Logout successful");
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token }: VerifyEmailDto = req.body;

    if (!token) {
      throw new ValidationError("Verification token is required");
    }

    await authService.verifyEmail(token);

    return successResponse(res, "Email verified successfully");
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email }: ForgotPasswordDto = req.body;

    if (!email || !isValidEmail(email)) {
      throw new ValidationError("Invalid email address");
    }

    await authService.forgotPassword(email);

    return successResponse(
      res,
      "Password reset email sent. Please check your email."
    );
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { token, newPassword }: ResetPasswordDto = req.body;

    if (!token) {
      throw new ValidationError("Reset token is required");
    }

    if (!newPassword || !isValidPassword(newPassword)) {
      throw new ValidationError("New password must be at least 8 characters");
    }

    await authService.resetPassword(token, newPassword);

    return successResponse(
      res,
      "Password reset successful. Please login with your new password."
    );
  } catch (error) {
    next(error);
  }
}
