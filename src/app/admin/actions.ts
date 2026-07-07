"use server";

import { signOut, auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/meridian-data";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export type LiveNotification = { title: string; time: string };

/**
 * Polled by the admin topbar every ~15s to surface newly-created bookings without a full page
 * refresh. Scoped to the signed-in owner's hotel (or platform-wide for the super admin), and
 * relies on the existing `@@index([hotelId])` / primary-key ordering on Booking — a single
 * cheap `findMany` per poll, so this stays lightweight even under heavy booking volume.
 */
export async function getNewBookingNotificationsAction(sinceIso: string): Promise<{
  count: number;
  notifications: LiveNotification[];
}> {
  const session = await auth();
  if (!session) return { count: 0, notifications: [] };

  const since = new Date(sinceIso);
  if (Number.isNaN(since.getTime())) return { count: 0, notifications: [] };

  if (session.user.systemRole === "HOTEL_OWNER" && session.user.hotelId) {
    const bookings = await prisma.booking.findMany({
      where: { hotelId: session.user.hotelId, createdAt: { gt: since } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        createdAt: true,
        guest: { select: { firstName: true, lastName: true } },
        roomType: { select: { name: true } },
      },
    });
    return {
      count: bookings.length,
      notifications: bookings.map((b) => ({
        title: `New booking · ${b.guest.firstName} ${b.guest.lastName} (${b.roomType.name})`,
        time: formatRelativeTime(b.createdAt),
      })),
    };
  }

  if (session.user.systemRole === "SUPER_ADMIN") {
    const [bookings, hotels] = await Promise.all([
      prisma.booking.findMany({
        where: { createdAt: { gt: since } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          createdAt: true,
          guest: { select: { firstName: true, lastName: true } },
          hotel: { select: { name: true } },
        },
      }),
      // New hotel signups are platform-level events only the Super Admin should be alerted to.
      prisma.hotel.findMany({
        where: { createdAt: { gt: since } },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { createdAt: true, name: true, owner: { select: { name: true, email: true } } },
      }),
    ]);

    const combined = [
      ...bookings.map((b) => ({
        createdAt: b.createdAt,
        title: `New booking · ${b.guest.firstName} ${b.guest.lastName} (${b.hotel.name})`,
      })),
      ...hotels.map((h) => ({
        createdAt: h.createdAt,
        title: `New hotel signed up · ${h.name} (${h.owner.name ?? h.owner.email})`,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      count: combined.length,
      notifications: combined.slice(0, 10).map((n) => ({
        title: n.title,
        time: formatRelativeTime(n.createdAt),
      })),
    };
  }

  return { count: 0, notifications: [] };
}
