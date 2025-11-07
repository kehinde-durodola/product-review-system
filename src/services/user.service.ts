import * as userRepository from "../repositories/user.repository.js";
import * as tokenRepository from "../repositories/token.repository.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/error.util.js";
import { UpdateUserDto, UpdatePasswordDto } from "../types/user.types.js";

export async function getUserProfile(userId: string) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const { password: _, isBanned: __, ...userResponse } = user;
  return userResponse;
}

export async function updateProfile(userId: string, data: UpdateUserDto) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError("Email already in use");
    }
  }

  const updatedUser = await userRepository.update(userId, data);
  const { password: _, isBanned: __, ...userResponse } = updatedUser;
  return userResponse;
}

export async function updatePassword(userId: string, data: UpdatePasswordDto) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isCurrentPasswordValid = await comparePassword(
    data.currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new UnauthorizedError("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(data.newPassword);
  await userRepository.updatePassword(userId, hashedPassword);
  await tokenRepository.deleteUserRefreshTokens(userId);
}

export async function banUser(userId: string) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await userRepository.banUser(userId);
  await tokenRepository.deleteUserRefreshTokens(userId);
}

export async function unbanUser(userId: string) {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await userRepository.unbanUser(userId);
}
