export interface CreateReviewDto {
  content: string;
  rating: number;
}

export interface UpdateReviewDto {
  content?: string;
  rating?: number;
}

export interface ReviewResponse {
  id: string;
  content: string;
  rating: number;
  user: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
