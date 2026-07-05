"use server";

import { revalidatePath } from "next/cache";
import { guestSchema } from "@/lib/validation";
import { createGuest, updateGuest, getGuest, DuplicateGuestError } from "@/lib/data/guests";
import { requireHotelOwnerSession } from "@/lib/session";
import { logActivity } from "@/lib/data/activity";

function parseGuestForm(formData: FormData) {
  return guestSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
  });
}

export async function getGuestAction(guestId: string) {
  const { hotelId } = await requireHotelOwnerSession();
  return getGuest(guestId, hotelId);
}

export async function createGuestAction(formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  const parsed = parseGuestForm(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  try {
    const guest = await createGuest(hotelId, parsed.data);
    await logActivity({ action: "guest.created", userId, hotelId, metadata: { guestId: guest.id } });
  } catch (err) {
    if (err instanceof DuplicateGuestError) return err.message;
    throw err;
  }
  revalidatePath("/admin/guests");
}

export async function updateGuestAction(guestId: string, formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  const parsed = parseGuestForm(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  try {
    await updateGuest(guestId, hotelId, parsed.data);
    await logActivity({ action: "guest.updated", userId, hotelId, metadata: { guestId } });
  } catch (err) {
    if (err instanceof DuplicateGuestError) return err.message;
    throw err;
  }
  revalidatePath("/admin/guests");
}
