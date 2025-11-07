import prisma from "../config/database.js";

export async function create(data: {
  content: string;
  rating: number;
  userId: string;
  productId: string;
}) {
  return await prisma.review.create({
    data,
    include: {
      user: {
        select: { id: true, name: true },
      },
      product: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function findById(id: string) {
  return await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true },
      },
      product: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function findByUser(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  return { reviews, total };
}

export async function findByProduct(
  productId: string,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { reviews, total };
}

export async function findByUserAndProduct(userId: string, productId: string) {
  return await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
}

export async function update(
  id: string,
  data: { content?: string; rating?: number }
) {
  return await prisma.review.update({
    where: { id },
    data,
    include: {
      user: {
        select: { id: true, name: true },
      },
      product: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function deleteReview(id: string) {
  return await prisma.review.delete({
    where: { id },
  });
}
