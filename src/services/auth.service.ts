import * as userRepository from "../repositories/user.repository.js";
import * as tokenRepository from "../repositories/token.repository.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt.util.js";
import { generateRandomToken } from "../utils/token.util.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/email.util.js";
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../utils/error.util.js";
import {
  VERIFICATION_TOKEN_EXPIRY,
  RESET_TOKEN_EXPIRY,
} from "../config/constants.js";
import { RegisterDto, LoginDto, AuthResponse } from "../types/auth.types.js";

export async function register(data: RegisterDto) {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new ValidationError("Email already in use");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await userRepository.create({
    email: data.email,
    password: hashedPassword,
    name: data.name,
  });

  const verificationToken = generateRandomToken(32);
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRY);

  await tokenRepository.saveVerificationToken(
    user.email,
    verificationToken,
    expiresAt
  );
  await sendVerificationEmail(user.email, verificationToken);

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function login(data: LoginDto): Promise<AuthResponse> {
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (user.isBanned) {
    throw new ForbiddenError("Account has been banned");
  }

  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await tokenRepository.saveRefreshToken(
    user.id,
    refreshToken,
    refreshTokenExpiresAt
  );

  const { password: _, isBanned: __, ...userResponse } = user;

  return {
    accessToken,
    refreshToken,
    user: userResponse,
  };
}

export async function refreshToken(token: string) {
  const storedToken = await tokenRepository.findRefreshToken(token);

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (storedToken.expiresAt < new Date()) {
    await tokenRepository.deleteRefreshToken(token);
    throw new UnauthorizedError("Refresh token expired");
  }

  const tokenPayload = {
    userId: storedToken.user.id,
    email: storedToken.user.email,
    role: storedToken.user.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);

  return {
    accessToken: newAccessToken,
    refreshToken: token,
  };
}

export async function logout(token: string) {
  await tokenRepository.deleteRefreshToken(token);
}

export async function verifyEmail(token: string) {
  const verificationToken = await tokenRepository.findVerificationToken(token);

  if (!verificationToken) {
    throw new ValidationError("Invalid verification token");
  }

  if (verificationToken.expiresAt < new Date()) {
    await tokenRepository.deleteVerificationToken(token);
    throw new ValidationError("Verification token expired");
  }

  await userRepository.verifyEmail(verificationToken.email);
  await tokenRepository.deleteVerificationToken(token);
}

export async function forgotPassword(email: string) {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const resetToken = generateRandomToken(32);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY);

  await tokenRepository.savePasswordResetToken(user.id, resetToken, expiresAt);
  await sendPasswordResetEmail(user.email, resetToken);
}

export async function resetPassword(token: string, newPassword: string) {
  const resetToken = await tokenRepository.findPasswordResetToken(token);

  if (!resetToken) {
    throw new ValidationError("Invalid reset token");
  }

  if (resetToken.expiresAt < new Date()) {
    await tokenRepository.deletePasswordResetToken(token);
    throw new ValidationError("Reset token expired");
  }

  const hashedPassword = await hashPassword(newPassword);

  await userRepository.updatePassword(resetToken.userId, hashedPassword);
  await tokenRepository.deleteUserPasswordResetTokens(resetToken.userId);
  await tokenRepository.deleteUserRefreshTokens(resetToken.userId);
}
