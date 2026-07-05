"use server";

import { redirect } from "next/navigation";
import { guestBookingSchema } from "@/lib/validation";
import { createBooking, RoomUnavailableError } from "@/lib/data/bookings";

export async function createBookingAction(
  _prevState: string | undefined,
  formData: FormData
): Promise<string | undefined> {
  const parsed = guestBookingSchema.safeParse({
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

  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Please check your details and try again.";

  let confirmationCode: string;
  try {
    const booking = await createBooking(parsed.data);
    confirmationCode = booking.confirmationCode;
  } catch (err) {
    if (err instanceof RoomUnavailableError) return err.message;
    throw err;
  }

  redirect(`/booking/confirm?booking=${confirmationCode}`);
}
