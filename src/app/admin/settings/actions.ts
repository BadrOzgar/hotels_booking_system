"use server";

import { revalidatePath } from "next/cache";
import { hotelSchema } from "@/lib/validation";
import { updateHotel, setHotelCoverImage } from "@/lib/data/hotels";
import { requireHotelOwnerSession } from "@/lib/session";
import { logActivity } from "@/lib/data/activity";
import { uploadMedia } from "@/lib/s3";
import { resolveGoogleMapsLink } from "@/lib/maps-link";
import { reverseGeocode } from "@/lib/geocoding";

export type ResolvedMapsLink = { lat: number; lng: number; city: string; country: string; address: string };

/** Resolves a pasted Google Maps link to coordinates + city/country/address for the "Locate on map" preview. */
export async function previewMapsLinkAction(mapsLink: string): Promise<ResolvedMapsLink | null> {
  await requireHotelOwnerSession();
  return resolveMapsLink(mapsLink);
}

async function resolveMapsLink(mapsLink: string): Promise<ResolvedMapsLink | null> {
  const coords = await resolveGoogleMapsLink(mapsLink);
  if (!coords) return null;
  const location = await reverseGeocode(coords.lat, coords.lng);
  if (!location) return null;
  return { ...coords, ...location };
}

export async function updateMyHotelAction(formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();

  const parsed = hotelSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    mapsLink: formData.get("mapsLink"),
    starRating: formData.get("starRating"),
    currency: formData.get("currency"),
    checkInTime: formData.get("checkInTime"),
    checkOutTime: formData.get("checkOutTime"),
    serviceFeeCents: formData.get("serviceFeeCents"),
    taxRatePercent: formData.get("taxRatePercent"),
    tag: formData.get("tag"),
    contactEmail: formData.get("contactEmail"),
    contactPhone: formData.get("contactPhone"),
    freeCancellationHours: formData.get("freeCancellationHours"),
    penaltyNights: formData.get("penaltyNights"),
    amenityIds: formData.getAll("amenityIds"),
  });
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  let location;
  if (parsed.data.mapsLink) {
    location = await resolveMapsLink(parsed.data.mapsLink);
    if (!location) return "Couldn't read a location from that Google Maps link. Please check it and try again.";
  }

  await updateHotel(hotelId, parsed.data, location);
  await logActivity({ action: "hotel.updated", userId, hotelId });

  const file = formData.get("coverImage");
  if (file instanceof File && file.size > 0) {
    try {
      const url = await uploadMedia(file, "hotels");
      await setHotelCoverImage(hotelId, url);
    } catch (err) {
      revalidatePath("/admin/settings");
      return err instanceof Error ? err.message : "Failed to upload cover media.";
    }
  }

  revalidatePath("/admin/settings");
}
