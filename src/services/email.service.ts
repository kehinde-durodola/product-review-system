import {
  sendVerificationEmail as sendVerification,
  sendPasswordResetEmail as sendReset,
} from "../utils/email.util.js";

export async function sendVerificationEmail(email: string, token: string) {
  await sendVerification(email, token);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  await sendReset(email, token);
}
