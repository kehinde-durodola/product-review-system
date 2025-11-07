import prisma from "../config/database.js";

export async function findByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

export async function create(data: {
  email: string;
  password: string;
  name: string;
}) {
  return await prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      name: data.name,
      role: "USER",
      isVerified: false,
      isBanned: false,
    },
  });
}

export async function update(
  id: string,
  data: { name?: string; email?: string }
) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function updatePassword(id: string, hashedPassword: string) {
  return await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
}

export async function verifyEmail(email: string) {
  return await prisma.user.update({
    where: { email },
    data: { isVerified: true },
  });
}

export async function banUser(id: string) {
  return await prisma.user.update({
    where: { id },
    data: { isBanned: true },
  });
}

export async function unbanUser(id: string) {
  return await prisma.user.update({
    where: { id },
    data: { isBanned: false },
  });
}
