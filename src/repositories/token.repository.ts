import prisma from "../config/database.js";

export async function saveRefreshToken(
  userId: string,
  token: string,
  expiresAt: Date
) {
  return await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

export async function findRefreshToken(token: string) {
  return await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function deleteRefreshToken(token: string) {
  return await prisma.refreshToken.delete({
    where: { token },
  });
}

export async function deleteUserRefreshTokens(userId: string) {
  return await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

export async function saveVerificationToken(
  email: string,
  token: string,
  expiresAt: Date
) {
  return await prisma.verificationToken.create({
    data: {
      token,
      email,
      expiresAt,
    },
  });
}

export async function findVerificationToken(token: string) {
  return await prisma.verificationToken.findUnique({
    where: { token },
  });
}

export async function deleteVerificationToken(token: string) {
  return await prisma.verificationToken.delete({
    where: { token },
  });
}

export async function savePasswordResetToken(
  userId: string,
  token: string,
  expiresAt: Date
) {
  return await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

export async function findPasswordResetToken(token: string) {
  return await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function deletePasswordResetToken(token: string) {
  return await prisma.passwordResetToken.delete({
    where: { token },
  });
}

export async function deleteUserPasswordResetTokens(userId: string) {
  return await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });
}
