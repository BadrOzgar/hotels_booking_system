"use server";

import { revalidatePath } from "next/cache";
import { hotelSchema } from "@/lib/validation";
import { updateHotel, setHotelCoverImage } from "@/lib/data/hotels";
import { requireHotelOwnerSession } from "@/lib/session";
import { logActivity } from "@/lib/data/activity";
import { uploadMedia } from "@/lib/s3";

export async function updateMyHotelAction(formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();

  const parsed = hotelSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    city: formData.get("city"),
    country: formData.get("country"),
    address: formData.get("address"),
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

  await updateHotel(hotelId, parsed.data);
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
