import Link from "next/link";
import { adminBookings, bookingStatusTokens } from "@/lib/meridian-data";

function buildGuests() {
  const map = new Map<
    string,
    { name: string; initials: string; gradient: string; stays: number; lastBookingId: string; lastStatus: string }
  >();

  for (const b of adminBookings) {
    const existing = map.get(b.guest);
    if (existing) {
      existing.stays += 1;
      existing.lastBookingId = b.id;
      existing.lastStatus = b.status;
    } else {
      map.set(b.guest, {
        name: b.guest,
        initials: b.initials,
        gradient: b.gradient,
        stays: 1,
        lastBookingId: b.id,
        lastStatus: b.status,
      });
    }
  }

  return Array.from(map.values());
}

export default function AdminGuestsPage() {
  const guests = buildGuests();

  return (
    <div className="fu p-8">
      <div>
        <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Guests</h1>
        <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
          {guests.length} guests &middot; {adminBookings.length} total bookings
        </p>
      </div>

      <div
        className="mt-[22px] overflow-hidden rounded-[20px] border border-[#E7E8EC] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <div className="hidden grid-cols-[1.6fr_1fr_1fr_90px] gap-4 bg-[#FBFBFC] px-6 py-4 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase lg:grid">
          <span>Guest</span>
          <span>Stays</span>
          <span>Last status</span>
          <span>Actions</span>
        </div>
        {guests.map((g) => {
          const st = bookingStatusTokens[g.lastStatus];
          return (
            <div
              key={g.name}
              className="rowh grid grid-cols-2 items-center gap-4 border-b border-[#F5F6F8] px-6 py-3.5 last:border-b-0 lg:grid-cols-[1.6fr_1fr_1fr_90px]"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: g.gradient }}
                >
                  {g.initials}
                </div>
                <span className="text-[14.5px] font-semibold">{g.name}</span>
              </div>
              <span className="text-sm text-[#6B7280]">{g.stays} {g.stays === 1 ? "stay" : "stays"}</span>
              <span
                className="w-fit rounded-full border px-2.5 py-1 text-xs font-bold"
                style={{ color: st.c, background: st.bg, borderColor: st.bd }}
              >
                {g.lastStatus}
              </span>
              <Link
                href={`/admin/bookings/${g.lastBookingId}`}
                className="navlink w-fit text-[13px] font-semibold text-[#7C8CF8]"
              >
                View booking
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
