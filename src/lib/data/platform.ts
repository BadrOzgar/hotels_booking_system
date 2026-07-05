import { prisma } from "@/lib/prisma";
import { listRecentActivity } from "@/lib/data/activity";
import type { HotelAccountStatus } from "@/generated/prisma/enums";

/** Simulated monthly plan pricing in MAD (no real billing gateway) — used for MRR. */
export const PLAN_PRICES: Record<string, number> = {
  TRIAL: 0,
  BASIC: 490,
  PRO: 1490,
};

export async function getPlatformStats() {
  const [totalHotels, totalRooms, totalBookings, revenueAgg, hotels, activeHotels] = await Promise.all([
    prisma.hotel.count(),
    prisma.roomUnit.count(),
    prisma.booking.count(),
    prisma.booking.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalAmount: true } }),
    prisma.hotel.findMany({ include: { subscription: true } }),
    prisma.hotel.count({ where: { accountStatus: "ACTIVE" } }),
  ]);

  const mrr = hotels.reduce((sum, h) => {
    if (h.subscription?.status !== "ACTIVE") return sum;
    return sum + (PLAN_PRICES[h.subscription.plan] ?? 0);
  }, 0);

  return {
    totalHotels,
    totalRooms,
    totalBookings,
    totalRevenue: Number(revenueAgg._sum.totalAmount ?? 0),
    mrr,
    activeHotels,
    inactiveHotels: totalHotels - activeHotels,
  };
}

export async function getRecentBookingsAcrossHotels(limit = 8) {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      hotel: { select: { name: true } },
      roomType: { select: { name: true, gradient: true } },
      guest: { select: { firstName: true, lastName: true } },
    },
  });
}

export async function getRecentActivityAcrossHotels(limit = 5) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { hotel: { select: { name: true } } },
  });
}

export async function listAllHotelsForAdmin(search?: string) {
  const hotels = await prisma.hotel.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { owner: { name: { contains: search, mode: "insensitive" } } },
            { owner: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { name: true, email: true } },
      subscription: true,
      images: { where: { isCover: true }, take: 1 },
      _count: { select: { roomUnits: true, bookings: true } },
    },
  });

  return hotels.map((h) => ({
    id: h.id,
    name: h.name,
    city: h.city,
    country: h.country,
    gradient: h.gradient,
    coverImageUrl: h.images[0]?.url ?? null,
    accountStatus: h.accountStatus,
    ownerName: h.owner.name ?? "—",
    ownerEmail: h.owner.email,
    plan: h.subscription?.plan ?? "TRIAL",
    subscriptionStatus: h.subscription?.status ?? "TRIALING",
    roomCount: h._count.roomUnits,
    bookingCount: h._count.bookings,
    createdAt: h.createdAt,
  }));
}

export async function getHotelForAdmin(hotelId: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: {
      owner: { select: { id: true, name: true, email: true, lastLoginAt: true, createdAt: true } },
      subscription: true,
      _count: { select: { roomUnits: true, bookings: true, guests: true } },
    },
  });
  if (!hotel) return null;

  const [occupiedRooms, revenueAgg, recentActivity] = await Promise.all([
    prisma.roomUnit.count({ where: { hotelId, status: "OCCUPIED" } }),
    prisma.booking.aggregate({
      where: { hotelId, status: { not: "CANCELLED" } },
      _sum: { totalAmount: true },
    }),
    listRecentActivity(hotelId, 10),
  ]);

  const occupancyRate = hotel._count.roomUnits > 0 ? Math.round((occupiedRooms / hotel._count.roomUnits) * 100) : 0;

  return {
    ...hotel,
    occupancyRate,
    revenue: Number(revenueAgg._sum.totalAmount ?? 0),
    recentActivity,
  };
}

export async function setHotelAccountStatus(hotelId: string, status: HotelAccountStatus) {
  return prisma.hotel.update({ where: { id: hotelId }, data: { accountStatus: status } });
}

/** Clears a hotel's transactional history (bookings/guests) for a fresh demo start — does not delete the hotel or owner account. */
export async function resetHotelAccount(hotelId: string) {
  await prisma.$transaction([
    prisma.booking.deleteMany({ where: { hotelId } }),
    prisma.guest.deleteMany({ where: { hotelId } }),
    prisma.roomUnit.updateMany({ where: { hotelId }, data: { status: "AVAILABLE" } }),
  ]);
}
