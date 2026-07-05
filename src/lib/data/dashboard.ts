import { prisma } from "@/lib/prisma";

/** The real current date/time — seed data is generated relative to this at seed-run time. */
export function today(): Date {
  return new Date();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

export async function getDashboardStats(hotelId: string) {
  const todayStart = startOfDay(today());
  const todayEnd = endOfDay(today());

  const [availableRooms, occupiedRooms, todayCheckIns, todayCheckOuts, upcoming, revenueAgg] =
    await Promise.all([
      prisma.roomUnit.count({ where: { hotelId, status: "AVAILABLE" } }),
      prisma.roomUnit.count({ where: { hotelId, status: "OCCUPIED" } }),
      prisma.booking.count({
        where: { hotelId, checkIn: { gte: todayStart, lte: todayEnd }, status: { not: "CANCELLED" } },
      }),
      prisma.booking.count({
        where: { hotelId, checkOut: { gte: todayStart, lte: todayEnd }, status: { not: "CANCELLED" } },
      }),
      prisma.booking.count({
        where: { hotelId, checkIn: { gt: todayEnd }, status: { in: ["PENDING", "CONFIRMED"] } },
      }),
      prisma.booking.aggregate({
        where: { hotelId, checkIn: { gte: todayStart, lte: todayEnd }, status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
    ]);

  return {
    availableRooms,
    occupiedRooms,
    todayCheckIns,
    todayCheckOuts,
    upcoming,
    revenueToday: Number(revenueAgg._sum.totalAmount ?? 0),
  };
}

export async function getRecentBookings(hotelId: string, limit = 5) {
  return prisma.booking.findMany({
    where: { hotelId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      roomType: { select: { name: true, gradient: true } },
      guest: { select: { firstName: true, lastName: true } },
    },
  });
}

export type CalendarBookingEvent = {
  bookingId: string;
  guestName: string;
  initials: string;
  roomName: string;
  gradient: string;
  status: string;
  kind: "in" | "out";
};

export async function getCalendarEvents(hotelId: string, year: number, month: number) {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      hotelId,
      status: { not: "CANCELLED" },
      OR: [
        { checkIn: { gte: monthStart, lte: monthEnd } },
        { checkOut: { gte: monthStart, lte: monthEnd } },
      ],
    },
    include: {
      guest: { select: { firstName: true, lastName: true } },
      roomType: { select: { name: true, gradient: true } },
    },
  });

  const eventsByDay = new Map<number, CalendarBookingEvent[]>();

  for (const b of bookings) {
    const guestName = `${b.guest.firstName} ${b.guest.lastName}`;
    const initials = `${b.guest.firstName[0] ?? ""}${b.guest.lastName[0] ?? ""}`.toUpperCase();
    if (b.checkIn >= monthStart && b.checkIn <= monthEnd) {
      const day = b.checkIn.getDate();
      const list = eventsByDay.get(day) ?? [];
      list.push({
        bookingId: b.id,
        guestName,
        initials,
        roomName: b.roomType.name,
        gradient: b.roomType.gradient,
        status: b.status,
        kind: "in",
      });
      eventsByDay.set(day, list);
    }
    if (b.checkOut >= monthStart && b.checkOut <= monthEnd) {
      const day = b.checkOut.getDate();
      const list = eventsByDay.get(day) ?? [];
      list.push({
        bookingId: b.id,
        guestName,
        initials,
        roomName: b.roomType.name,
        gradient: b.roomType.gradient,
        status: b.status,
        kind: "out",
      });
      eventsByDay.set(day, list);
    }
  }

  return eventsByDay;
}
