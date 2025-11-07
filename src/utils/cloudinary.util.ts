import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export async function uploadToCloudinary(
  filePath: string,
  folder: string = "products"
): Promise<string> {
  const result = await cloudinary.uploader.upload(filePath, {
    folder,
  });

  await fs.unlink(filePath);

  return result.secure_url;
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
