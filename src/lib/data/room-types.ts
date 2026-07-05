import { prisma } from "@/lib/prisma";
import type { RoomTypeInput } from "@/lib/validation";
import { isForeignKeyError } from "@/lib/data/errors";
import { formatBeds } from "@/lib/meridian-data";

export type PublicRoomListing = {
  id: string;
  hotelId: string;
  hotel: { id: string; name: string; city: string; country: string };
  name: string;
  type: string;
  description: string;
  price: number;
  cap: number;
  size: number | null;
  bath: number;
  gradient: string;
  coverImageUrl: string | null;
  beds: string;
  rating: number;
  reviews: number;
  tag?: string;
};

const ACTIVE_BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN"] as const;

/** Options for the Add/Edit Booking room-type selector. */
export async function listRoomTypeOptions(hotelId: string) {
  return prisma.roomType.findMany({
    where: { hotelId },
    orderBy: { basePricePerNight: "asc" },
    select: { id: true, name: true, basePricePerNight: true, capacity: true },
  });
}

/** Admin "Rooms" list: one row per physical RoomUnit for the signed-in owner's hotel. */
export async function listRoomUnits(hotelId: string) {
  const units = await prisma.roomUnit.findMany({
    where: { hotelId },
    orderBy: { createdAt: "desc" },
    include: {
      roomType: {
        select: {
          id: true,
          name: true,
          basePricePerNight: true,
          capacity: true,
          gradient: true,
          images: { where: { isCover: true }, take: 1 },
        },
      },
    },
  });
  return units;
}

/** Verifies the unit belongs to hotelId before returning it (defense against guessing another tenant's id). */
export async function getRoomUnitForEdit(unitId: string, hotelId: string) {
  const unit = await prisma.roomUnit.findFirst({
    where: { id: unitId, hotelId },
    include: {
      roomType: { include: { amenities: true, images: { orderBy: { sortOrder: "asc" } } } },
    },
  });
  if (!unit) return null;
  return {
    ...unit,
    roomType: {
      ...unit.roomType,
      basePricePerNight: Number(unit.roomType.basePricePerNight),
    },
    amenityIds: unit.roomType.amenities.map((a) => a.amenityId),
    images: unit.roomType.images,
    coverImageUrl: unit.roomType.images.find((img) => img.isCover)?.url ?? unit.roomType.images[0]?.url ?? null,
  };
}

/** Public room detail page — only reachable while the owning hotel's account is ACTIVE. */
export async function getRoomType(id: string) {
  const rt = await prisma.roomType.findFirst({
    where: { id, hotel: { accountStatus: "ACTIVE" } },
    include: {
      hotel: true,
      images: { orderBy: { sortOrder: "asc" } },
      amenities: { include: { amenity: true } },
      beds: true,
      units: true,
      reviews: { select: { rating: true } },
    },
  });
  if (!rt) return null;

  const rating = rt.reviews.length ? rt.reviews.reduce((s, r) => s + r.rating, 0) / rt.reviews.length : 0;
  return { ...rt, rating: Math.round(rating * 10) / 10, reviewCount: rt.reviews.length };
}

export async function createRoomType(hotelId: string, input: RoomTypeInput) {
  return prisma.roomType.create({
    data: {
      hotelId,
      name: input.name,
      category: input.category,
      description: input.description,
      basePricePerNight: input.basePricePerNight,
      capacity: input.capacity,
      sizeSqm: input.sizeSqm ?? null,
      bathrooms: input.bathrooms,
      amenities: { create: input.amenityIds.map((amenityId) => ({ amenityId })) },
      units: {
        create: { hotelId, unitNumber: input.unitNumber, status: input.status },
      },
    },
  });
}

export async function updateRoomTypeAndUnit(unitId: string, hotelId: string, input: RoomTypeInput) {
  const unit = await prisma.roomUnit.findFirstOrThrow({ where: { id: unitId, hotelId } });

  await prisma.$transaction(async (tx) => {
    await tx.roomType.update({
      where: { id: unit.roomTypeId },
      data: {
        name: input.name,
        category: input.category,
        description: input.description,
        basePricePerNight: input.basePricePerNight,
        capacity: input.capacity,
        sizeSqm: input.sizeSqm ?? null,
        bathrooms: input.bathrooms,
      },
    });

    await tx.roomTypeAmenity.deleteMany({ where: { roomTypeId: unit.roomTypeId } });
    if (input.amenityIds.length) {
      await tx.roomTypeAmenity.createMany({
        data: input.amenityIds.map((amenityId) => ({ roomTypeId: unit.roomTypeId, amenityId })),
      });
    }

    await tx.roomUnit.update({
      where: { id: unitId },
      data: { unitNumber: input.unitNumber, status: input.status },
    });
  });

  return unit.roomTypeId;
}

export class RoomHasBookingsError extends Error {
  constructor() {
    super("This room has existing bookings and cannot be deleted.");
    this.name = "RoomHasBookingsError";
  }
}

/** Deletes the physical unit. If it was the room type's only unit, the (now unit-less) room type is deleted too. */
export async function deleteRoomUnit(unitId: string, hotelId: string) {
  const unit = await prisma.roomUnit.findFirstOrThrow({ where: { id: unitId, hotelId } });

  const activeBookings = await prisma.booking.count({
    where: { roomUnitId: unitId, status: { in: [...ACTIVE_BOOKING_STATUSES] } },
  });
  if (activeBookings > 0) throw new RoomHasBookingsError();

  await prisma.roomUnit.delete({ where: { id: unitId } });

  const remainingUnits = await prisma.roomUnit.count({ where: { roomTypeId: unit.roomTypeId } });
  if (remainingUnits === 0) {
    try {
      await prisma.roomType.delete({ where: { id: unit.roomTypeId } });
    } catch (err) {
      if (!isForeignKeyError(err)) throw err;
      // Room type has historical bookings referencing it (Restrict) — leave it, just unlisted with 0 units.
    }
  }
}

type AvailabilityFilters = {
  hotelId?: string;
  destination?: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  roomsCount?: number;
};

/**
 * A room type is available for a date range if at least one of its RoomUnits
 * has no overlapping, non-cancelled booking in that range. Only hotels whose
 * account is ACTIVE are ever offered publicly.
 */
export async function getAvailableRoomTypes(filters: AvailabilityFilters) {
  const roomsCount = filters.roomsCount ?? 1;

  const destination = filters.destination?.trim();

  const roomTypes = await prisma.roomType.findMany({
    where: {
      ...(filters.hotelId ? { hotelId: filters.hotelId } : {}),
      hotel: {
        accountStatus: "ACTIVE",
        ...(destination
          ? {
              OR: [
                { name: { contains: destination, mode: "insensitive" } },
                { city: { contains: destination, mode: "insensitive" } },
                { country: { contains: destination, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      capacity: { gte: Math.ceil(filters.guests / roomsCount) },
    },
    include: {
      hotel: { select: { id: true, name: true, city: true, country: true } },
      beds: true,
      images: { where: { isCover: true }, take: 1 },
      units: {
        include: {
          bookings: {
            where: {
              status: { in: [...ACTIVE_BOOKING_STATUSES] },
              checkIn: { lt: filters.checkOut },
              checkOut: { gt: filters.checkIn },
            },
            select: { id: true },
          },
        },
      },
      reviews: { select: { rating: true } },
    },
    orderBy: { basePricePerNight: "asc" },
  });

  return roomTypes
    .map((rt) => {
      const availableUnits = rt.units.filter((u) => u.bookings.length === 0 && u.status !== "MAINTENANCE" && u.status !== "HIDDEN");
      const rating = rt.reviews.length ? rt.reviews.reduce((s, r) => s + r.rating, 0) / rt.reviews.length : 0;
      const listing: PublicRoomListing & { availableUnitCount: number } = {
        id: rt.id,
        hotelId: rt.hotelId,
        hotel: rt.hotel,
        name: rt.name,
        type: rt.category,
        description: rt.description,
        price: Number(rt.basePricePerNight),
        cap: rt.capacity,
        size: rt.sizeSqm,
        bath: rt.bathrooms,
        gradient: rt.gradient,
        coverImageUrl: rt.images[0]?.url ?? null,
        beds: formatBeds(rt.beds),
        rating: Math.round(rating * 10) / 10,
        reviews: rt.reviews.length,
        availableUnitCount: availableUnits.length,
      };
      return listing;
    })
    .filter((rt) => rt.availableUnitCount >= roomsCount);
}

/** Homepage "Featured stays" — highest-rated room types across all ACTIVE hotels. */
export async function getFeaturedRoomTypes(limit = 3): Promise<PublicRoomListing[]> {
  const roomTypes = await prisma.roomType.findMany({
    where: { hotel: { accountStatus: "ACTIVE" } },
    take: limit * 3,
    include: {
      hotel: { select: { id: true, name: true, city: true, country: true } },
      beds: true,
      images: { where: { isCover: true }, take: 1 },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return roomTypes
    .map((rt) => {
      const rating = rt.reviews.length ? rt.reviews.reduce((s, r) => s + r.rating, 0) / rt.reviews.length : 0;
      const listing: PublicRoomListing = {
        id: rt.id,
        hotelId: rt.hotelId,
        hotel: rt.hotel,
        name: rt.name,
        type: rt.category,
        description: rt.description,
        price: Number(rt.basePricePerNight),
        cap: rt.capacity,
        size: rt.sizeSqm,
        bath: rt.bathrooms,
        gradient: rt.gradient,
        coverImageUrl: rt.images[0]?.url ?? null,
        beds: formatBeds(rt.beds),
        rating: Math.round(rating * 10) / 10,
        reviews: rt.reviews.length,
      };
      return listing;
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/** Appends one or more media items to a room type's gallery. The very first image ever added becomes the cover. */
export async function addRoomTypeImages(roomTypeId: string, urls: string[]) {
  if (urls.length === 0) return;
  const [existingCount, hasCover] = await Promise.all([
    prisma.roomTypeImage.count({ where: { roomTypeId } }),
    prisma.roomTypeImage.count({ where: { roomTypeId, isCover: true } }),
  ]);
  await prisma.roomTypeImage.createMany({
    data: urls.map((url, i) => ({
      roomTypeId,
      url,
      isCover: hasCover === 0 && i === 0,
      sortOrder: existingCount + i,
    })),
  });
}

/** Removes one image from a room type's gallery, verifying the room type belongs to hotelId, and promotes the next image to cover if needed. */
export async function deleteRoomTypeImage(imageId: string, roomTypeId: string, hotelId: string) {
  const image = await prisma.roomTypeImage.findFirst({
    where: { id: imageId, roomTypeId, roomType: { hotelId } },
  });
  if (!image) return;

  await prisma.roomTypeImage.delete({ where: { id: imageId } });

  if (image.isCover) {
    const next = await prisma.roomTypeImage.findFirst({ where: { roomTypeId }, orderBy: { sortOrder: "asc" } });
    if (next) await prisma.roomTypeImage.update({ where: { id: next.id }, data: { isCover: true } });
  }
}
