import { listGuestsWithStats } from "@/lib/data/guests";
import { requireHotelOwnerSession } from "@/lib/session";
import { AdminGuestsTable } from "@/components/admin/admin-guests-table";

export default async function AdminGuestsPage() {
  const { hotelId } = await requireHotelOwnerSession();
  const guests = await listGuestsWithStats(hotelId);
  const totalBookings = guests.reduce((sum, g) => sum + g.stays, 0);

  return (
    <div className="fu p-8">
      <div>
        <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Guests</h1>
        <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
          {guests.length} guests &middot; {totalBookings} total bookings
        </p>
      </div>

      <AdminGuestsTable guests={guests} />
    </div>
  );
}
