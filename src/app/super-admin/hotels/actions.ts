"use server";

import { revalidatePath } from "next/cache";
import { hotelSchema } from "@/lib/validation";
import { updateHotel, setHotelCoverImage } from "@/lib/data/hotels";
import { setHotelAccountStatus, resetHotelAccount, getHotelForAdmin } from "@/lib/data/platform";
import { requireSuperAdminSession } from "@/lib/session";
import { logActivity } from "@/lib/data/activity";
import { uploadMedia } from "@/lib/s3";
import type { HotelAccountStatus } from "@/generated/prisma/enums";

export async function setHotelAccountStatusAction(hotelId: string, status: HotelAccountStatus) {
  const { userId } = await requireSuperAdminSession();
  await setHotelAccountStatus(hotelId, status);
  await logActivity({ action: `hotel.${status.toLowerCase()}`, userId, hotelId });
  revalidatePath("/super-admin/hotels");
  revalidatePath(`/super-admin/hotels/${hotelId}`);
}

export async function resetHotelAccountAction(hotelId: string) {
  const { userId } = await requireSuperAdminSession();
  await resetHotelAccount(hotelId);
  await logActivity({ action: "hotel.reset", userId, hotelId });
  revalidatePath("/super-admin/hotels");
  revalidatePath(`/super-admin/hotels/${hotelId}`);
}

export async function updateHotelAction(hotelId: string, formData: FormData): Promise<string | undefined> {
  const { userId } = await requireSuperAdminSession();

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
      revalidatePath(`/super-admin/hotels/${hotelId}`);
      return err instanceof Error ? err.message : "Failed to upload cover media.";
    }
  }

  revalidatePath(`/super-admin/hotels/${hotelId}`);
}

export async function getHotelForAdminAction(hotelId: string) {
  await requireSuperAdminSession();
  return getHotelForAdmin(hotelId);
}
