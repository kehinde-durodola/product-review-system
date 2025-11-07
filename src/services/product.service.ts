import * as productRepository from "../repositories/product.repository.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.util.js";
import { isValidCategory } from "../utils/validation.util.js";
import { ValidationError, NotFoundError } from "../utils/error.util.js";
import { CreateProductDto, UpdateProductDto } from "../types/product.types.js";

export async function createProduct(
  data: CreateProductDto,
  imageFile?: Express.Multer.File
) {
  if (!isValidCategory(data.category)) {
    throw new ValidationError("Invalid product category");
  }

  let imageUrl: string | null = null;

  if (imageFile) {
    imageUrl = await uploadToCloudinary(imageFile.path, "products");
  }

  return await productRepository.create(data, imageUrl);
}

export async function getProductById(id: string) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const averageRating = await productRepository.getAverageRating(id);
  const reviewCount = await productRepository.getReviewCount(id);

  return {
    ...product,
    averageRating,
    reviewCount,
  };
}

export async function getAllProducts(page: number, limit: number) {
  const { products, total } = await productRepository.findAll(page, limit);

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const averageRating = await productRepository.getAverageRating(
        product.id
      );
      const reviewCount = product.reviews.length;
      return {
        ...product,
        averageRating,
        reviewCount,
      };
    })
  );

  return {
    products: productsWithRatings,
    total,
  };
}

export async function getProductsByCategory(
  category: string,
  page: number,
  limit: number
) {
  if (!isValidCategory(category)) {
    throw new ValidationError("Invalid product category");
  }

  const { products, total } = await productRepository.findByCategory(
    category,
    page,
    limit
  );

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const averageRating = await productRepository.getAverageRating(
        product.id
      );
      const reviewCount = product.reviews.length;
      return {
        ...product,
        averageRating,
        reviewCount,
      };
    })
  );

  return {
    products: productsWithRatings,
    total,
  };
}

export async function searchProducts(
  query: string,
  page: number,
  limit: number
) {
  const { products, total } = await productRepository.search(
    query,
    page,
    limit
  );

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const averageRating = await productRepository.getAverageRating(
        product.id
      );
      const reviewCount = product.reviews.length;
      return {
        ...product,
        averageRating,
        reviewCount,
      };
    })
  );

  return {
    products: productsWithRatings,
    total,
  };
}

export async function updateProduct(
  id: string,
  data: UpdateProductDto,
  imageFile?: Express.Multer.File
) {
  const existingProduct = await productRepository.findById(id);

  if (!existingProduct) {
    throw new NotFoundError("Product not found");
  }

  if (data.category && !isValidCategory(data.category)) {
    throw new ValidationError("Invalid product category");
  }

  let imageUrl: string | undefined;

  if (imageFile) {
    imageUrl = await uploadToCloudinary(imageFile.path, "products");

    if (existingProduct.imageUrl) {
      const publicId = existingProduct.imageUrl
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await deleteFromCloudinary(publicId);
    }
  }

  return await productRepository.update(id, data, imageUrl);
}

export async function deleteProduct(id: string) {
  const product = await productRepository.findById(id);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (product.imageUrl) {
    const publicId = product.imageUrl
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await productRepository.deleteProduct(id);
}
