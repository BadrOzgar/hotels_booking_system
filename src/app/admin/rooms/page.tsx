import { listRoomUnits } from "@/lib/data/room-types";
import { listAmenities } from "@/lib/data/content";
import { requireHotelOwnerSession } from "@/lib/session";
import { AdminRoomsTable } from "@/components/admin/admin-rooms-table";

export default async function AdminRoomsPage() {
  const { hotelId } = await requireHotelOwnerSession();
  const [units, amenities] = await Promise.all([listRoomUnits(hotelId), listAmenities()]);

  const rows = units.map((u) => ({
    unitId: u.id,
    name: u.roomType.name,
    number: u.unitNumber,
    price: Number(u.roomType.basePricePerNight),
    cap: u.roomType.capacity,
    status: u.status,
    gradient: u.roomType.gradient,
    coverImageUrl: u.roomType.images[0]?.url ?? null,
  }));

  const occupied = rows.filter((r) => r.status === "OCCUPIED").length;
  const available = rows.filter((r) => r.status === "AVAILABLE").length;

  return (
    <div className="fu p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Rooms</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            {rows.length} rooms · {occupied} occupied · {available} available
          </p>
        </div>
      </div>

      <AdminRoomsTable rows={rows} amenities={amenities.map((a) => ({ id: a.id, label: a.label }))} />
    </div>
  );
}
