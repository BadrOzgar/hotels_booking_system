"use server";

import { requestPasswordResetSchema, resetPasswordSchema } from "@/lib/validation";
import { createPasswordResetOtp, isPasswordResetOtpValid, resetPasswordWithOtp } from "@/lib/data/password-reset";
import { sendPasswordResetOtpEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

/** Always succeeds regardless of whether the email is registered, so this can't be used to enumerate accounts. */
export async function requestPasswordResetOtpAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = requestPasswordResetSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const code = await createPasswordResetOtp(parsed.data.email);
    try {
      await sendPasswordResetOtpEmail(parsed.data.email, code);
    } catch {
      // Swallow — we still show the generic "check your email" step either way so we
      // don't reveal account existence via a delivery-failure error.
    }
  }
}

export async function verifyPasswordResetOtpAction(email: string, code: string): Promise<boolean> {
  return isPasswordResetOtpValid(email, code);
}

export async function resetPasswordAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = resetPasswordSchema.safeParse({
    email: formData.get("email"),
    code: formData.get("code"),
    password: formData.get("password"),
  });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  const ok = await resetPasswordWithOtp(parsed.data.email, parsed.data.code, parsed.data.password);
  if (!ok) return "That code is invalid or has expired — request a new one.";
}
