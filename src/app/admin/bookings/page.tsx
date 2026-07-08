import { listAdminBookings } from "@/lib/data/bookings";
import { listRoomTypeOptions } from "@/lib/data/room-types";
import { requireHotelOwnerSession } from "@/lib/session";
import { AdminBookingsTable } from "@/components/admin/admin-bookings-table";

export default async function AdminBookingsPage() {
  const { hotelId } = await requireHotelOwnerSession();
  const [bookings, roomOptions] = await Promise.all([
    listAdminBookings(hotelId),
    listRoomTypeOptions(hotelId),
  ]);

  const rows = bookings.map((b) => ({
    id: b.id,
    confirmationCode: b.confirmationCode,
    guestName: `${b.guest.firstName} ${b.guest.lastName}`,
    initials: `${b.guest.firstName[0] ?? ""}${b.guest.lastName[0] ?? ""}`.toUpperCase(),
    roomName: b.roomType.name,
    unitNumber: b.roomUnit?.unitNumber ?? "—",
    gradient: b.roomType.gradient,
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    guests: b.adults + b.children,
    status: b.status,
    paymentStatus: b.payments[0]?.status ?? "PENDING",
  }));

  const pending = rows.filter((r) => r.status === "PENDING").length;

  return (
    <div className="fu p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Bookings</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            {rows.length} total &middot; {pending} awaiting approval
          </p>
        </div>
      </div>

      <AdminBookingsTable
        rows={rows}
        roomOptions={roomOptions.map((r) => ({ ...r, basePricePerNight: Number(r.basePricePerNight) }))}
      />
    </div>
  );
}
