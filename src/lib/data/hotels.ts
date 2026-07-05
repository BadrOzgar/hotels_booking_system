import { prisma } from "@/lib/prisma";
import type { HotelInput } from "@/lib/validation";

/** Public site: only hotels the Super Admin hasn't suspended/pending-gated. */
export async function listHotels() {
  const hotels = await prisma.hotel.findMany({
    where: { accountStatus: "ACTIVE" },
    orderBy: { name: "asc" },
    include: {
      roomTypes: { select: { id: true, basePricePerNight: true } },
      reviews: { select: { rating: true } },
      images: { where: { isCover: true }, take: 1 },
    },
  });

  return hotels.map((h) => {
    const priceFrom = h.roomTypes.length
      ? Math.min(...h.roomTypes.map((rt) => Number(rt.basePricePerNight)))
      : 0;
    const rating = h.reviews.length
      ? h.reviews.reduce((sum, r) => sum + r.rating, 0) / h.reviews.length
      : 0;
    return {
      id: h.id,
      code: h.code,
      name: h.name,
      city: h.city,
      country: h.country,
      tag: h.tag,
      gradient: h.gradient,
      coverImageUrl: h.images[0]?.url ?? null,
      description: h.description,
      priceFrom,
      rating: Math.round(rating * 10) / 10,
      reviewCount: h.reviews.length,
    };
  });
}

export async function getHotel(id: string) {
  return prisma.hotel.findUnique({
    where: { id },
    include: {
      cancellationPolicy: true,
      amenities: { include: { amenity: true } },
      images: { where: { isCover: true }, take: 1 },
    },
  });
}

/** Replaces the hotel's cover photo (single image for now) with the given URL. */
export async function setHotelCoverImage(hotelId: string, url: string) {
  await prisma.$transaction([
    prisma.hotelImage.deleteMany({ where: { hotelId, isCover: true } }),
    prisma.hotelImage.create({ data: { hotelId, url, isCover: true } }),
  ]);
}

/** Public hotel detail page — only reachable while the hotel's account is ACTIVE. */
export async function getHotelWithRoomTypes(id: string) {
  const hotel = await prisma.hotel.findUnique({
    where: { id, accountStatus: "ACTIVE" },
    include: {
      roomTypes: {
        include: {
          beds: true,
          amenities: { include: { amenity: true } },
          units: true,
          images: { where: { isCover: true }, take: 1 },
        },
        orderBy: { basePricePerNight: "asc" },
      },
      reviews: { select: { rating: true } },
      images: { where: { isCover: true }, take: 1 },
    },
  });
  if (!hotel) return null;

  const rating = hotel.reviews.length
    ? hotel.reviews.reduce((sum, r) => sum + r.rating, 0) / hotel.reviews.length
    : 0;

  return { ...hotel, rating: Math.round(rating * 10) / 10, reviewCount: hotel.reviews.length };
}

/** Creates a hotel for a brand-new owner (used only by the /signup flow). */
export async function createHotelForOwner(ownerId: string, input: HotelInput) {
  const code = await generateHotelCode(input.name);

  return prisma.hotel.create({
    data: {
      ownerId,
      code,
      name: input.name,
      description: input.description,
      city: input.city,
      country: input.country,
      address: input.address,
      starRating: input.starRating,
      currency: input.currency,
      checkInTime: input.checkInTime,
      checkOutTime: input.checkOutTime,
      serviceFeeCents: input.serviceFeeCents,
      taxRatePercent: input.taxRatePercent,
      tag: input.tag || null,
      contactEmail: input.contactEmail || null,
      contactPhone: input.contactPhone || null,
      amenities: {
        create: input.amenityIds.map((amenityId) => ({ amenityId })),
      },
      cancellationPolicy: {
        create: {
          freeCancellationHours: input.freeCancellationHours,
          penaltyNights: input.penaltyNights,
        },
      },
      subscription: {
        create: { plan: "TRIAL", status: "TRIALING", trialEndsAt: new Date(Date.now() + 14 * 86_400_000) },
      },
    },
  });
}

export async function updateHotel(id: string, input: HotelInput) {
  return prisma.$transaction(async (tx) => {
    await tx.hotel.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        city: input.city,
        country: input.country,
        address: input.address,
        starRating: input.starRating,
        currency: input.currency,
        checkInTime: input.checkInTime,
        checkOutTime: input.checkOutTime,
        serviceFeeCents: input.serviceFeeCents,
        taxRatePercent: input.taxRatePercent,
        tag: input.tag || null,
        contactEmail: input.contactEmail || null,
        contactPhone: input.contactPhone || null,
      },
    });

    await tx.hotelAmenity.deleteMany({ where: { hotelId: id } });
    if (input.amenityIds.length) {
      await tx.hotelAmenity.createMany({
        data: input.amenityIds.map((amenityId) => ({ hotelId: id, amenityId })),
      });
    }

    await tx.cancellationPolicy.upsert({
      where: { hotelId: id },
      update: { freeCancellationHours: input.freeCancellationHours, penaltyNights: input.penaltyNights },
      create: { hotelId: id, freeCancellationHours: input.freeCancellationHours, penaltyNights: input.penaltyNights },
    });
  });
}

async function generateHotelCode(name: string): Promise<string> {
  const base = name
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4) || "HTL";

  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = attempt === 0 ? base : `${base}${attempt}`;
    const existing = await prisma.hotel.findUnique({ where: { code: candidate } });
    if (!existing) return candidate;
  }
  return `${base}${Date.now().toString().slice(-4)}`;
}
