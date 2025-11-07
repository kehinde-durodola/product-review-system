import crypto from "crypto";

export function generateRandomToken(length: number = 32): string {
  return crypto.randomBytes(length).toString("hex");
}
