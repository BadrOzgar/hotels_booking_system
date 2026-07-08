import { prisma } from "@/lib/prisma";
import { computePricing, generateConfirmationCode, nightsBetween } from "@/lib/pricing";
import type { GuestBookingInput } from "@/lib/validation";
import type { BookingStatus, BookingSource } from "@/generated/prisma/enums";

export class RoomUnavailableError extends Error {
  constructor() {
    super("No rooms of this type are available for the selected dates.");
    this.name = "RoomUnavailableError";
  }
}

/**
 * Creates a booking. `expectedHotelId` is passed by admin-invoked callers
 * (Add Booking) to verify the chosen room type actually belongs to their own
 * hotel — the public booking flow leaves it undefined since roomTypeId there
 * always comes from a page the guest browsed on that hotel already.
 */
export async function createBooking(
  input: GuestBookingInput,
  options?: { source?: BookingSource; expectedHotelId?: string }
) {
  const checkIn = new Date(`${input.checkIn}T15:00:00`);
  const checkOut = new Date(`${input.checkOut}T11:00:00`);
  if (checkOut <= checkIn) throw new Error("Check-out must be after check-in.");

  return prisma.$transaction(async (tx) => {
    const roomType = await tx.roomType.findUniqueOrThrow({
      where: { id: input.roomTypeId },
      include: { hotel: true },
    });

    if (options?.expectedHotelId && roomType.hotelId !== options.expectedHotelId) {
      throw new Error("This room does not belong to your hotel.");
    }

    // Re-check availability inside the transaction to close the race window.
    const candidateUnits = await tx.roomUnit.findMany({
      where: {
        roomTypeId: input.roomTypeId,
        status: { notIn: ["MAINTENANCE", "HIDDEN"] },
        bookings: {
          none: {
            status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
            checkIn: { lt: checkOut },
            checkOut: { gt: checkIn },
          },
        },
      },
      take: 1,
    });
    const unit = candidateUnits[0];
    if (!unit) throw new RoomUnavailableError();

    const guest = await tx.guest.upsert({
      where: { hotelId_email: { hotelId: roomType.hotelId, email: input.email } },
      update: { firstName: input.firstName, lastName: input.lastName, phone: input.phone || undefined },
      create: {
        hotelId: roomType.hotelId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone || null,
      },
    });

    const nights = nightsBetween(checkIn, checkOut);
    const isCard = input.paymentMethod === "CARD";
    // Pay-at-hotel bookings settle everything (including any local fees/taxes) directly
    // with the front desk — we only charge the room rate through the platform.
    const pricing = computePricing({
      pricePerNight: Number(roomType.basePricePerNight),
      nights,
      serviceFeeCents: isCard ? roomType.hotel.serviceFeeCents : 0,
      taxRatePercent: isCard ? Number(roomType.hotel.taxRatePercent) : 0,
    });

    let confirmationCode = generateConfirmationCode(roomType.hotel.code);
    for (let attempt = 0; attempt < 5; attempt++) {
      const clash = await tx.booking.findUnique({ where: { confirmationCode } });
      if (!clash) break;
      confirmationCode = generateConfirmationCode(roomType.hotel.code);
    }

    const booking = await tx.booking.create({
      data: {
        confirmationCode,
        hotelId: roomType.hotelId,
        roomTypeId: roomType.id,
        roomUnitId: unit.id,
        guestId: guest.id,
        contactFirstName: input.firstName,
        contactLastName: input.lastName,
        contactEmail: input.email,
        contactPhone: input.phone || null,
        specialRequests: input.specialRequests || null,
        checkIn,
        checkOut,
        nights,
        adults: input.adults,
        children: input.children,
        status: "CONFIRMED",
        source: options?.source ?? "DIRECT",
        baseAmount: pricing.base,
        serviceFeeAmount: pricing.serviceFee,
        taxAmount: pricing.tax,
        totalAmount: pricing.total,
        statusHistory: { create: { toStatus: "CONFIRMED", note: "Created via public booking flow" } },
        payments: {
          create: {
            method: input.paymentMethod,
            status: isCard ? "PAID" : "PENDING",
            amount: pricing.total,
            cardLast4: isCard && input.cardNumber ? input.cardNumber.replace(/\s+/g, "").slice(-4) : null,
            paidAt: isCard ? new Date() : null,
            provider: isCard ? "simulated" : null,
          },
        },
        invoice: {
          create: {
            invoiceNumber: `INV-${confirmationCode}`,
            status: "ISSUED",
            issuedAt: new Date(),
            totalAmount: pricing.total,
            lineItems: {
              create: [
                {
                  label: `${roomType.name} × ${nights} nights`,
                  unitAmount: roomType.basePricePerNight,
                  quantity: nights,
                  amount: pricing.base,
                  sortOrder: 0,
                },
                ...(pricing.serviceFee > 0
                  ? [{ label: "Service fee", unitAmount: pricing.serviceFee, amount: pricing.serviceFee, sortOrder: 1 }]
                  : []),
                ...(pricing.tax > 0
                  ? [{ label: "Taxes", unitAmount: pricing.tax, amount: pricing.tax, sortOrder: 2 }]
                  : []),
              ],
            },
          },
        },
      },
    });

    return booking;
  });
}

export async function getBookingByConfirmationCode(code: string) {
  return prisma.booking.findUnique({
    where: { confirmationCode: code },
    include: {
      hotel: true,
      roomType: { include: { images: { where: { isCover: true }, take: 1 } } },
      roomUnit: true,
    },
  });
}

export async function listAdminBookings(hotelId: string) {
  return prisma.booking.findMany({
    where: { hotelId },
    orderBy: { createdAt: "desc" },
    include: {
      roomType: { select: { name: true, gradient: true } },
      roomUnit: { select: { unitNumber: true } },
      guest: { select: { firstName: true, lastName: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function getAdminBooking(id: string, hotelId: string) {
  return prisma.booking.findFirst({
    where: { id, hotelId },
    include: {
      hotel: true,
      roomType: { include: { images: { where: { isCover: true }, take: 1 } } },
      roomUnit: true,
      guest: { include: { _count: { select: { bookings: true } } } },
      payments: { orderBy: { createdAt: "desc" } },
      invoice: { include: { lineItems: { orderBy: { sortOrder: "asc" } } } },
      statusHistory: { orderBy: { createdAt: "desc" } },
    },
  });
}

export class PaymentNotFoundError extends Error {
  constructor() {
    super("No payment record found for this booking.");
    this.name = "PaymentNotFoundError";
  }
}

/** Front desk marks a pay-at-hotel payment as collected (cash/card taken in person at check-in). */
export async function markPaymentPaid(bookingId: string, hotelId: string) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, hotelId },
    include: { payments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });
  const payment = booking?.payments[0];
  if (!payment) throw new PaymentNotFoundError();

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "PAID", paidAt: new Date(), provider: payment.provider ?? "front_desk" },
  });
}

const UNIT_STATUS_BY_BOOKING_STATUS: Partial<Record<BookingStatus, "OCCUPIED" | "AVAILABLE">> = {
  CHECKED_IN: "OCCUPIED",
  CHECKED_OUT: "AVAILABLE",
  CANCELLED: "AVAILABLE",
};

export async function updateBookingStatus(
  id: string,
  hotelId: string,
  status: BookingStatus,
  changedByUserId?: string
) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.booking.findFirstOrThrow({ where: { id, hotelId } });

    await tx.booking.update({ where: { id }, data: { status } });
    await tx.bookingStatusHistory.create({
      data: { bookingId: id, fromStatus: current.status, toStatus: status, changedByUserId },
    });

    const nextUnitStatus = UNIT_STATUS_BY_BOOKING_STATUS[status];
    if (nextUnitStatus && current.roomUnitId) {
      await tx.roomUnit.update({ where: { id: current.roomUnitId }, data: { status: nextUnitStatus } });
    }
  });
}

export type BookingDetailsInput = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  specialRequests?: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone?: string;
};

/** Edits the mutable details of an existing booking (distinct from status transitions). */
export async function updateBookingDetails(id: string, hotelId: string, input: BookingDetailsInput) {
  const booking = await prisma.booking.findFirstOrThrow({ where: { id, hotelId } });

  const checkIn = new Date(`${input.checkIn}T15:00:00`);
  const checkOut = new Date(`${input.checkOut}T11:00:00`);
  if (checkOut <= checkIn) throw new Error("Check-out must be after check-in.");
  const nights = nightsBetween(checkIn, checkOut);

  const pricePerNight = Number(booking.baseAmount) / booking.nights;
  const baseAmount = pricePerNight * nights;
  const totalAmount = baseAmount + Number(booking.serviceFeeAmount) + Number(booking.taxAmount) - Number(booking.discountAmount);

  return prisma.booking.update({
    where: { id },
    data: {
      checkIn,
      checkOut,
      nights,
      adults: input.adults,
      children: input.children,
      specialRequests: input.specialRequests || null,
      contactFirstName: input.contactFirstName,
      contactLastName: input.contactLastName,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone || null,
      baseAmount,
      totalAmount,
    },
  });
}
