"use server";

import { revalidatePath } from "next/cache";
import { roomTypeSchema } from "@/lib/validation";
import {
  createRoomType,
  updateRoomTypeAndUnit,
  deleteRoomUnit,
  getRoomUnitForEdit,
  addRoomTypeImages,
  deleteRoomTypeImage,
  RoomHasBookingsError,
} from "@/lib/data/room-types";
import { requireHotelOwnerSession } from "@/lib/session";
import { logActivity } from "@/lib/data/activity";
import { uploadMedia } from "@/lib/s3";
import { createAmenity, setDefaultAmenitiesForAllRooms } from "@/lib/data/content";

async function handleMediaUpload(formData: FormData, roomTypeId: string): Promise<string | undefined> {
  const files = formData.getAll("media").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return undefined;
  try {
    const urls = await Promise.all(files.map((file) => uploadMedia(file, "rooms")));
    await addRoomTypeImages(roomTypeId, urls);
    return undefined;
  } catch (err) {
    return err instanceof Error ? err.message : "Failed to upload media.";
  }
}

function parseRoomTypeForm(formData: FormData) {
  return roomTypeSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description"),
    basePricePerNight: formData.get("basePricePerNight"),
    capacity: formData.get("capacity"),
    sizeSqm: formData.get("sizeSqm") || undefined,
    bathrooms: formData.get("bathrooms"),
    unitNumber: formData.get("unitNumber"),
    status: formData.get("status"),
    amenityIds: formData.getAll("amenityIds"),
  });
}

export async function getRoomUnitForEditAction(unitId: string) {
  const { hotelId } = await requireHotelOwnerSession();
  return getRoomUnitForEdit(unitId, hotelId);
}

export async function createRoomTypeAction(formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  const parsed = parseRoomTypeForm(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  const roomType = await createRoomType(hotelId, parsed.data);
  await logActivity({ action: "room.created", userId, hotelId, metadata: { roomTypeId: roomType.id, name: parsed.data.name } });
  const uploadError = await handleMediaUpload(formData, roomType.id);
  revalidatePath("/admin/rooms");
  return uploadError;
}

export async function updateRoomTypeAction(unitId: string, formData: FormData): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  const parsed = parseRoomTypeForm(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Invalid input.";

  const roomTypeId = await updateRoomTypeAndUnit(unitId, hotelId, parsed.data);
  await logActivity({ action: "room.updated", userId, hotelId, metadata: { unitId, name: parsed.data.name } });
  const uploadError = await handleMediaUpload(formData, roomTypeId);
  revalidatePath("/admin/rooms");
  return uploadError;
}

export async function deleteRoomImageAction(imageId: string, roomTypeId: string): Promise<void> {
  const { hotelId } = await requireHotelOwnerSession();
  await deleteRoomTypeImage(imageId, roomTypeId, hotelId);
  revalidatePath("/admin/rooms");
}

export async function createAmenityAction(label: string): Promise<{ id: string; label: string; icon: string | null }> {
  await requireHotelOwnerSession();
  const amenity = await createAmenity(label);
  return { id: amenity.id, label: amenity.label, icon: amenity.icon };
}

export async function applyDefaultAmenitiesAction(amenityIds: string[]): Promise<void> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  await setDefaultAmenitiesForAllRooms(hotelId, amenityIds);
  await logActivity({ action: "room.amenities_defaulted", userId, hotelId, metadata: { amenityIds } });
  revalidatePath("/admin/rooms");
}

export async function deleteRoomUnitAction(unitId: string): Promise<string | undefined> {
  const { userId, hotelId } = await requireHotelOwnerSession();
  try {
    await deleteRoomUnit(unitId, hotelId);
  } catch (err) {
    if (err instanceof RoomHasBookingsError) return err.message;
    throw err;
  }
  await logActivity({ action: "room.deleted", userId, hotelId, metadata: { unitId } });
  revalidatePath("/admin/rooms");
}
