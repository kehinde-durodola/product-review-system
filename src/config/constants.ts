export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food & Beverages",
  "Health & Beauty",
] as const;

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const RATING_MIN = 1;
export const RATING_MAX = 5;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000;
export const RESET_TOKEN_EXPIRY = 60 * 60 * 1000;
