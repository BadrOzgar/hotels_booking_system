import { prisma } from "@/lib/prisma";

export async function listAmenities() {
  return prisma.amenity.findMany({ orderBy: { label: "asc" } });
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
