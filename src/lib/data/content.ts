import { prisma } from "@/lib/prisma";

export async function listAmenities() {
  return prisma.amenity.findMany({ orderBy: { label: "asc" } });
}

/** Adds a custom amenity to the shared catalog, reusing an existing one with the same label if it already exists. */
export async function createAmenity(label: string) {
  const trimmed = label.trim();
  if (!trimmed) throw new Error("Amenity name is required.");

  const existing = await prisma.amenity.findFirst({ where: { label: { equals: trimmed, mode: "insensitive" } } });
  if (existing) return existing;

  const key = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return prisma.amenity.upsert({
    where: { key },
    update: {},
    create: { key: key || `amenity_${Date.now()}`, label: trimmed },
  });
}

/** Replaces every room type's amenity set for the hotel with the given list — the "set as default for all rooms" action. */
export async function setDefaultAmenitiesForAllRooms(hotelId: string, amenityIds: string[]) {
  await prisma.$transaction(async (tx) => {
    await tx.roomTypeAmenity.deleteMany({ where: { roomType: { hotelId } } });
    if (amenityIds.length === 0) return;

    const roomTypes = await tx.roomType.findMany({ where: { hotelId }, select: { id: true } });
    if (roomTypes.length === 0) return;

    await tx.roomTypeAmenity.createMany({
      data: roomTypes.flatMap((rt) => amenityIds.map((amenityId) => ({ roomTypeId: rt.id, amenityId }))),
    });
  });
}

/** Amenities attached to at least one hotel — used for the homepage "resort amenities" grid. */
export async function listHotelLevelAmenities() {
  return prisma.amenity.findMany({
    where: { hotels: { some: {} } },
    orderBy: { label: "asc" },
  });
}

export async function listFaqs(hotelId?: string) {
  return prisma.faq.findMany({
    where: { hotelId: hotelId ?? null },
    orderBy: { sortOrder: "asc" },
  });
}

export async function listFeaturedReviews(limit = 3) {
  return prisma.review.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { booking: { select: { contactFirstName: true, contactLastName: true } }, hotel: { select: { city: true, country: true } } },
  });
}
