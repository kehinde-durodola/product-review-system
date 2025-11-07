export interface CreateProductDto {
  name: string;
  description: string;
  category: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  category?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
