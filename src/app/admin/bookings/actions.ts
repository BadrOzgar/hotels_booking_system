"use server";

import { revalidatePath } from "next/cache";
import { requireHotelOwnerSession } from "@/lib/session";
import {
  createBooking,
  updateBookingStatus,
  updateBookingDetails,
  markPaymentPaid,
  RoomUnavailableError,
} from "@/lib/data/bookings";
import { logActivity } from "@/lib/data/activity";
import { guestBookingSchema } from "@/lib/validation";
import type { BookingStatus } from "@/generated/prisma/enums";

export async function updateBookingStatusAction(bookingId: string, status: BookingStatus) {
  const { userId, hotelId } = await requireHotelOwnerSession();
  await updateBookingStatus(bookingId, hotelId, status, userId);
  await logActivity({ action: "booking.status_changed", userId, hotelId, metadata: { bookingId, status } });
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function markPaymentPaidAction(bookingId: string) {
  const { userId, hotelId } = await requireHotelOwnerSession();
  await markPaymentPaid(bookingId, hotelId);
  await logActivity({ action: "payment.marked_paid", userId, hotelId, metadata: { bookingId } });
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
}

function parseBookingForm(formData: FormData) {
  return guestBookingSchema.safeParse({
    roomTypeId: formData.get("roomTypeId"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    specialRequests: formData.get("specialRequests"),
    checkIn: formData.get("checkIn"),
    checkOut: formData.get("checkOut"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    paymentMethod: formData.get("paymentMethod"),
    cardNumber: formData.get("cardNumber"),
  });
}

export async function createBookingAction(formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  const parsed = parseBookingForm(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Please check the booking details.";

  const source = formData.get("source") === "WALK_IN" ? "WALK_IN" : "PHONE";

  let confirmationCode: string;
  try {
    const booking = await createBooking(parsed.data, { source, expectedHotelId: hotelId });
    confirmationCode = booking.confirmationCode;
  } catch (err) {
    if (err instanceof RoomUnavailableError) return err.message;
    throw err;
  }

  await logActivity({ action: "booking.created", userId, hotelId, metadata: { confirmationCode, source } });
  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
}

export async function updateBookingDetailsAction(bookingId: string, formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();

  const checkIn = String(formData.get("checkIn") ?? "");
  const checkOut = String(formData.get("checkOut") ?? "");
  const adults = Math.max(1, Number(formData.get("adults")) || 1);
  const children = Math.max(0, Number(formData.get("children")) || 0);
  const contactFirstName = String(formData.get("contactFirstName") ?? "").trim();
  const contactLastName = String(formData.get("contactLastName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const specialRequests = String(formData.get("specialRequests") ?? "").trim();

  if (!checkIn || !checkOut || !contactFirstName || !contactLastName || !contactEmail) {
    return "Please fill in all required fields.";
  }

  try {
    await updateBookingDetails(bookingId, hotelId, {
      checkIn,
      checkOut,
      adults,
      children,
      specialRequests,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
    });
  } catch (err) {
    if (err instanceof Error) return err.message;
    throw err;
  }

  await logActivity({ action: "booking.edited", userId, hotelId, metadata: { bookingId } });
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/bookings");
}
