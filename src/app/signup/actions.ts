"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import { addHotelImages } from "@/lib/data/hotels";
import { uploadMedia } from "@/lib/s3";
import { resolveGoogleMapsLink } from "@/lib/maps-link";
import { reverseGeocode } from "@/lib/geocoding";

const MAX_SIGNUP_IMAGES = 3;

export type ResolvedMapsLink = { lat: number; lng: number; city: string; country: string; address: string };

/** Lets the "Locate on map" preview on the signup form check a Maps link resolves before creating the account. */
export async function previewSignupMapsLinkAction(mapsLink: string): Promise<ResolvedMapsLink | null> {
  return resolveMapsLink(mapsLink);
}

async function resolveMapsLink(mapsLink: string): Promise<ResolvedMapsLink | null> {
  const coords = await resolveGoogleMapsLink(mapsLink);
  if (!coords) return null;
  const location = await reverseGeocode(coords.lat, coords.lng);
  if (!location) return null;
  return { ...coords, ...location };
}

export async function signupAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = signupSchema.safeParse({
    ownerName: formData.get("ownerName"),
    email: formData.get("email"),
    password: formData.get("password"),
    hotelName: formData.get("hotelName"),
    mapsLink: formData.get("mapsLink"),
  });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Please check your details and try again.";

  const { ownerName, email, password, hotelName, mapsLink } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return "An account with this email already exists.";

  // Resolved before the transaction opens — it's a network call, and shouldn't hold a DB
  // transaction open.
  const location = await resolveMapsLink(mapsLink);
  if (!location) return "Couldn't read a location from that Google Maps link. Please check it and try again.";

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
        city: location.city,
        country: location.country,
        address: location.address,
        latitude: location.lat,
        longitude: location.lng,
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
