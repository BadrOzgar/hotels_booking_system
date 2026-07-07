"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import { addHotelImages } from "@/lib/data/hotels";
import { uploadMedia } from "@/lib/s3";

const MAX_SIGNUP_IMAGES = 3;

export async function signupAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = signupSchema.safeParse({
    ownerName: formData.get("ownerName"),
    email: formData.get("email"),
    password: formData.get("password"),
    hotelName: formData.get("hotelName"),
    city: formData.get("city"),
    country: formData.get("country"),
    address: formData.get("address"),
  });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Please check your details and try again.";

  const { ownerName, email, password, hotelName, city, country, address } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return "An account with this email already exists.";

  const passwordHash = await bcrypt.hash(password, 12);
  const code = await generateHotelCode(hotelName);

  const hotelId = await prisma.$transaction(async (tx) => {
    const owner = await tx.user.create({
      data: { name: ownerName, email, password: passwordHash, systemRole: "HOTEL_OWNER" },
    });

    const hotel = await tx.hotel.create({
      data: {
        ownerId: owner.id,
        code,
        name: hotelName,
        description: `${hotelName} — newly onboarded on Meridian.`,
        city,
        country,
        address,
        cancellationPolicy: { create: { freeCancellationHours: 48, penaltyNights: 1 } },
        subscription: {
          create: { plan: "TRIAL", status: "TRIALING", trialEndsAt: new Date(Date.now() + 14 * 86_400_000) },
        },
      },
    });

    await tx.activityLog.create({
      data: { userId: owner.id, action: "hotel.signup", metadata: { hotelName } },
    });

    return hotel.id;
  });

  // Best-effort: photos are a nice-to-have at signup, never worth blocking account creation over.
  const imageFiles = formData
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_SIGNUP_IMAGES);
  if (imageFiles.length > 0) {
    try {
      const urls = await Promise.all(imageFiles.map((file) => uploadMedia(file, "hotels")));
      await addHotelImages(hotelId, urls);
    } catch {
      // Owner can add photos later from My Hotel settings — don't fail signup over an upload hiccup.
    }
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) return "Account created — please sign in.";
    throw error;
  }
}

async function generateHotelCode(name: string): Promise<string> {
  const base =
    name
      .replace(/[^a-zA-Z\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 4) || "HTL";

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = attempt === 0 ? base : `${base}${attempt}`;
    const existing = await prisma.hotel.findUnique({ where: { code: candidate } });
    if (!existing) return candidate;
  }
  return `${base}${Date.now().toString().slice(-4)}`;
}
