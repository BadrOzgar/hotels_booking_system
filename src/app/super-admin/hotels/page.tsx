import Link from "next/link";
import { Search } from "lucide-react";
import { listAllHotelsForAdmin } from "@/lib/data/platform";
import { hotelAccountStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import { coverStyle } from "@/lib/media";

export default async function SuperAdminHotelsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const hotels = await listAllHotelsForAdmin(q);

  return (
    <div className="fu p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Hotels</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} on the platform.
          </p>
        </div>
        <form className="relative w-full sm:w-[320px]">
          <Search className="absolute top-1/2 left-3.5 size-[17px] -translate-y-1/2 text-[#9CA3AF]" />
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search by name, city, owner…"
            className="w-full rounded-xl border border-[#E7E8EC] bg-white py-2.5 pr-3.5 pl-10 text-sm outline-none"
          />
        </form>
      </div>

      <div
        className="mt-[26px] overflow-hidden rounded-[20px] border border-[#E7E8EC] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <div className="hidden grid-cols-[1.6fr_1.2fr_1fr_.9fr_.8fr_.8fr] gap-4 bg-[#FBFBFC] px-6 py-4 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase lg:grid">
          <span>Hotel</span>
          <span>Owner</span>
          <span>Plan</span>
          <span>Rooms</span>
          <span>Bookings</span>
          <span>Status</span>
        </div>
        {hotels.length === 0 && (
          <div className="px-6 py-14 text-center text-[14px] font-medium text-[#9CA3AF]">
            No hotels match your search.
          </div>
        )}
        {hotels.map((h) => {
          const st = hotelAccountStatusTokens[h.accountStatus];
          return (
            <Link
              key={h.id}
              href={`/super-admin/hotels/${h.id}`}
              className="rowh grid grid-cols-2 items-center gap-4 border-b border-[#F5F6F8] px-6 py-4 last:border-b-0 lg:grid-cols-[1.6fr_1.2fr_1fr_.9fr_.8fr_.8fr]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="size-9 shrink-0 rounded-xl bg-cover bg-center"
                  style={coverStyle(h.coverImageUrl, h.gradient)}
                />
                <div>
                  <div className="text-[14.5px] font-semibold">{h.name}</div>
                  <div className="text-[12.5px] font-medium text-[#9CA3AF]">
                    {h.city}, {h.country}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[13.5px] font-semibold text-[#374151]">{h.ownerName}</div>
                <div className="text-[12.5px] font-medium text-[#9CA3AF]">{h.ownerEmail}</div>
              </div>
              <span className="text-[13.5px] font-medium text-[#374151]">{formatStatusLabel(h.plan)}</span>
              <span className="text-[13.5px] text-[#6B7280]">{h.roomCount}</span>
              <span className="text-[13.5px] text-[#6B7280]">{h.bookingCount}</span>
              <span
                className="w-fit rounded-full border px-2.5 py-1 text-xs font-bold"
                style={{ color: st.c, background: st.bg, borderColor: st.bd }}
              >
                {formatStatusLabel(h.accountStatus)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
