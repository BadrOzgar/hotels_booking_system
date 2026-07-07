import { auth } from "@/lib/auth";

/**
 * Asserts the caller is a signed-in HOTEL_OWNER and returns their userId +
 * hotelId. Every owner-scoped server action/query should route through this
 * instead of trusting a hotelId passed from the client.
 */
export async function requireHotelOwnerSession() {
  const session = await auth();
  if (!session || session.user.systemRole !== "HOTEL_OWNER" || !session.user.hotelId) {
    throw new Error("Not authorized.");
  }
  return { userId: session.user.id, hotelId: session.user.hotelId };
}

export async function requireSuperAdminSession() {
  const session = await auth();
  if (!session || session.user.systemRole !== "SUPER_ADMIN") {
    throw new Error("Not authorized.");
  }
  return { userId: session.user.id };
}
