import { prisma } from "@/lib/prisma";

export async function listGuestsWithStats(hotelId: string) {
  const guests = await prisma.guest.findMany({
    where: { hotelId },
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, status: true },
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return guests.map((g) => ({
    id: g.id,
    firstName: g.firstName,
    lastName: g.lastName,
    name: `${g.firstName} ${g.lastName}`,
    initials: `${g.firstName[0] ?? ""}${g.lastName[0] ?? ""}`.toUpperCase(),
    email: g.email,
    phone: g.phone,
    notes: g.notes,
    stays: g._count.bookings,
    lastBookingId: g.bookings[0]?.id,
    lastStatus: g.bookings[0]?.status,
  }));
}

export async function getGuest(id: string, hotelId: string) {
  return prisma.guest.findFirst({ where: { id, hotelId } });
}

export type GuestInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes?: string;
};

export class DuplicateGuestError extends Error {
  constructor() {
    super("A customer with this email already exists.");
    this.name = "DuplicateGuestError";
  }
}

export async function createGuest(hotelId: string, input: GuestInput) {
  const existing = await prisma.guest.findUnique({
    where: { hotelId_email: { hotelId, email: input.email } },
  });
  if (existing) throw new DuplicateGuestError();

  return prisma.guest.create({
    data: {
      hotelId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || null,
      notes: input.notes || null,
    },
  });
}

export async function updateGuest(id: string, hotelId: string, input: GuestInput) {
  await prisma.guest.findFirstOrThrow({ where: { id, hotelId } });

  const existing = await prisma.guest.findUnique({
    where: { hotelId_email: { hotelId, email: input.email } },
  });
  if (existing && existing.id !== id) throw new DuplicateGuestError();

  return prisma.guest.update({
    where: { id },
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone || null,
      notes: input.notes || null,
    },
  });
}
