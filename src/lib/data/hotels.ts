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
      images: { orderBy: { sortOrder: "asc" } },
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
      coverImageUrl: h.images.find((img) => img.isCover)?.url ?? h.images[0]?.url ?? null,
      images: h.images.map((img) => ({ url: img.url })),
      description: h.description,
      priceFrom,
      rating: Math.round(rating * 10) / 10,
      reviewCount: h.reviews.length,
    };
  });
}

/** Distinct "City, Country" and hotel-name suggestions for the homepage destination search. */
export async function listDestinationSuggestions(): Promise<string[]> {
  const hotels = await prisma.hotel.findMany({
    where: { accountStatus: "ACTIVE" },
    select: { name: true, city: true, country: true },
  });

  const suggestions = new Set<string>();
  for (const h of hotels) {
    suggestions.add(`${h.city}, ${h.country}`);
    suggestions.add(h.name);
  }
  return Array.from(suggestions).sort();
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

/** Appends one or more media items to a hotel's gallery. The very first image ever added becomes the cover. */
export async function addHotelImages(hotelId: string, urls: string[]) {
  if (urls.length === 0) return;
  const [existingCount, hasCover] = await Promise.all([
    prisma.hotelImage.count({ where: { hotelId } }),
    prisma.hotelImage.count({ where: { hotelId, isCover: true } }),
  ]);
  await prisma.hotelImage.createMany({
    data: urls.map((url, i) => ({
      hotelId,
      url,
      isCover: hasCover === 0 && i === 0,
      sortOrder: existingCount + i,
    })),
  });
}

/** Removes one image from a hotel's gallery and promotes the next image to cover if needed. */
export async function deleteHotelImage(imageId: string, hotelId: string) {
  const image = await prisma.hotelImage.findFirst({ where: { id: imageId, hotelId } });
  if (!image) return;

  await prisma.hotelImage.delete({ where: { id: imageId } });

  if (image.isCover) {
    const next = await prisma.hotelImage.findFirst({ where: { hotelId }, orderBy: { sortOrder: "asc" } });
    if (next) await prisma.hotelImage.update({ where: { id: next.id }, data: { isCover: true } });
  }
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

/** The hotel's location, always derived server-side from a pasted Google Maps link. */
export type ResolvedLocation = { city: string; country: string; address: string; lat: number; lng: number };

/** `location` is omitted when the owner didn't paste a new Maps link — the existing location is left untouched. */
export async function updateHotel(id: string, input: HotelInput, location?: ResolvedLocation) {
  return prisma.$transaction(async (tx) => {
    await tx.hotel.update({
      where: { id },
      data: {
        name: input.name,
        description: input.description,
        ...(location
          ? { city: location.city, country: location.country, address: location.address, latitude: location.lat, longitude: location.lng }
          : {}),
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
