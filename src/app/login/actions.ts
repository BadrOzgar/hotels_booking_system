"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

// Matches the account created by prisma/seed.ts.
const SEEDED_ADMIN_EMAIL = "admin@meridian.co";
const SEEDED_ADMIN_PASSWORD = "admin12345";

export async function authenticate(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    throw error;
  }
}

export async function continueWithGmail() {
  await signIn("credentials", {
    email: SEEDED_ADMIN_EMAIL,
    password: SEEDED_ADMIN_PASSWORD,
    redirectTo: "/admin",
  });
}
