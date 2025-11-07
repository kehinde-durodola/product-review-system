import prisma from "../config/database.js";

export async function create(
  data: { name: string; description: string; category: string },
  imageUrl: string | null = null
) {
  return await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      imageUrl,
    },
  });
}

export async function findById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
}

export async function findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true,
      },
    }),
    prisma.product.count(),
  ]);

  return { products, total };
}

export async function findByCategory(
  category: string,
  page: number,
  limit: number
) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { category },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true,
      },
    }),
    prisma.product.count({ where: { category } }),
  ]);

  return { products, total };
}

export async function search(query: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        reviews: true,
      },
    }),
    prisma.product.count({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    }),
  ]);

  return { products, total };
}

export async function update(
  id: string,
  data: { name?: string; description?: string; category?: string },
  imageUrl?: string
) {
  return await prisma.product.update({
    where: { id },
    data: {
      ...data,
      ...(imageUrl && { imageUrl }),
    },
  });
}

export async function deleteProduct(id: string) {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function getAverageRating(productId: string): Promise<number> {
  const result = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
  });

  return result._avg.rating || 0;
}

export async function getReviewCount(productId: string): Promise<number> {
  return await prisma.review.count({
    where: { productId },
  });
}
