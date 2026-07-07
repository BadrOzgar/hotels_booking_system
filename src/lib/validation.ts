import { z } from "zod";

/**
 * `FormData.get(name)` returns `null` for a field that isn't rendered in the DOM at all
 * (e.g. an input only shown for one branch of a toggle), but Zod's `.optional()` only
 * accepts `undefined`. Left as `.optional().or(z.literal(""))`, a genuinely-missing field
 * fails validation with a generic "Invalid input" error instead of being treated as blank.
 * This helper normalizes null/undefined/empty to "" so optional text fields never fail
 * just because the input wasn't present when the form was submitted.
 */
function optionalString() {
  return z
    .string()
    .trim()
    .nullish()
    .transform((v) => v ?? "");
}

export const hotelSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().min(10, "Description is required"),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  address: z.string().trim().min(1, "Address is required"),
  starRating: z.coerce.number().int().min(0).max(5),
  currency: z.string().trim().min(1).default("MAD"),
  checkInTime: z.string().trim().min(1),
  checkOutTime: z.string().trim().min(1),
  serviceFeeCents: z.coerce.number().int().min(0),
  taxRatePercent: z.coerce.number().min(0).max(100),
  tag: optionalString(),
  contactEmail: z.union([z.literal(""), z.string().trim().email("Invalid email")]).nullish().transform((v) => v ?? ""),
  contactPhone: optionalString(),
  freeCancellationHours: z.coerce.number().int().min(0),
  penaltyNights: z.coerce.number().int().min(0),
  amenityIds: z.array(z.string()).default([]),
});
export type HotelInput = z.infer<typeof hotelSchema>;

export const signupSchema = z.object({
  ownerName: z.string().trim().min(2, "Your name is required"),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  hotelName: z.string().trim().min(2, "Hotel name is required"),
  city: z.string().trim().min(1, "City is required"),
  country: z.string().trim().min(1, "Country is required"),
  address: z.string().trim().min(1, "Address is required"),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const roomTypeSchema = z.object({
  name: z.string().trim().min(2, "Room title is required"),
  category: z.string().trim().min(1, "Room type is required"),
  description: z.string().trim().min(10, "Description is required"),
  basePricePerNight: z.coerce.number().positive("Price must be greater than 0"),
  capacity: z.coerce.number().int().min(1),
  sizeSqm: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0),
  unitNumber: z.string().trim().min(1, "Room number is required"),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "HIDDEN"]),
  amenityIds: z.array(z.string()).default([]),
});
export type RoomTypeInput = z.infer<typeof roomTypeSchema>;

export const guestSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: optionalString(),
  notes: optionalString(),
});
export type GuestInput = z.infer<typeof guestSchema>;

export const guestBookingSchema = z.object({
  roomTypeId: z.string().min(1),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),
  phone: optionalString(),
  specialRequests: optionalString(),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.coerce.number().int().min(1),
  children: z.coerce.number().int().min(0),
  paymentMethod: z.enum(["CARD", "PAY_AT_HOTEL"]),
  cardNumber: optionalString(),
});
export type GuestBookingInput = z.infer<typeof guestBookingSchema>;
