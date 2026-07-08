import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const OTP_TTL_MINUTES = 10;

function generateOtp(): string {
  return String(Math.floor(100_000 + Math.random() * 900_000));
}

/** Replaces any existing reset code for this email with a fresh one and returns it to be emailed. */
export async function createPasswordResetOtp(email: string): Promise<string> {
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  const expires = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateOtp();
    try {
      await prisma.verificationToken.create({ data: { identifier: email, token: code, expires } });
      return code;
    } catch {
      // `token` is globally unique — an extremely rare collision with another user's code.
      // Retry with a freshly generated one.
    }
  }
  throw new Error("Couldn't generate a reset code. Please try again.");
}

export async function isPasswordResetOtpValid(email: string, code: string): Promise<boolean> {
  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: code } },
  });
  return Boolean(record && record.expires > new Date());
}

/** Verifies the OTP one last time, then updates the password and invalidates the code. */
export async function resetPasswordWithOtp(email: string, code: string, newPassword: string): Promise<boolean> {
  const valid = await isPasswordResetOtpValid(email, code);
  if (!valid) return false;

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { password: passwordHash } }),
    prisma.verificationToken.deleteMany({ where: { identifier: email } }),
  ]);
  return true;
}
