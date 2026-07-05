import Link from "next/link";
import { Building2, BedDouble, CalendarCheck, DollarSign, TrendingUp, Power } from "lucide-react";
import { getPlatformStats, getRecentBookingsAcrossHotels } from "@/lib/data/platform";
import { formatStatusLabel, bookingStatusTokens } from "@/lib/meridian-data";
import { formatCurrency } from "@/lib/pricing";

function formatShortDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function SuperAdminDashboardPage() {
  const [stats, recentBookings] = await Promise.all([
    getPlatformStats(),
    getRecentBookingsAcrossHotels(8),
  ]);

  const statCards = [
    { icon: Building2, bg: "#F3F5FF", fg: "#7C8CF8", value: String(stats.totalHotels), label: "Total hotels" },
    { icon: BedDouble, bg: "#EDFBF3", fg: "#4FB878", value: String(stats.totalRooms), label: "Total rooms" },
    { icon: CalendarCheck, bg: "#EAF6FF", fg: "#3FA9F5", value: String(stats.totalBookings), label: "Total bookings" },
    { icon: DollarSign, bg: "#FBF4EA", fg: "#D9A441", value: formatCurrency(stats.totalRevenue), label: "Total revenue" },
    { icon: TrendingUp, bg: "#FFF3EC", fg: "#E88A5A", value: formatCurrency(stats.mrr), label: "MRR" },
    { icon: Power, bg: "#F4F5F7", fg: "#6B7280", value: `${stats.activeHotels}/${stats.inactiveHotels}`, label: "Active / inactive" },
  ];

  return (
    <div className="fu p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Platform overview</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            Every hotel on Meridian, at a glance.
          </p>
        </div>
        <Link
          href="/super-admin/hotels"
          className="btnp flex w-fit items-center gap-2 rounded-[13px] px-5 py-3 text-[14.5px] font-semibold text-white"
          style={{ background: "#1F2937" }}
        >
          Manage hotels
        </Link>
      </div>

      <div className="mt-[26px] grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="lift rounded-[18px] border border-[#E7E8EC] bg-white p-5"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
              <s.icon className="size-5" style={{ color: s.fg }} />
            </div>
            <div className="mt-4 text-[24px] font-extrabold tracking-[-.02em]">{s.value}</div>
            <div className="mt-0.5 text-[13px] font-semibold text-[#9CA3AF]">{s.label}</div>
          </div>
        ))}
      </div>

      <div
        className="mt-[26px] rounded-[20px] border border-[#E7E8EC] bg-white p-6"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <h2 className="text-[17px] font-bold">Recent bookings across all hotels</h2>
        <div className="mt-4">
          <div className="grid grid-cols-[1.4fr_1.2fr_1.2fr_1fr_.9fr] gap-3 border-b border-[#F0F1F4] px-3 pb-3 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase">
            <span>Hotel</span>
            <span>Guest</span>
            <span>Room</span>
            <span>Dates</span>
            <span>Status</span>
          </div>
          {recentBookings.length === 0 && (
            <div className="px-3 py-8 text-center text-[13.5px] font-medium text-[#9CA3AF]">
              No bookings yet.
            </div>
          )}
          {recentBookings.map((b) => {
            const st = bookingStatusTokens[b.status];
            return (
              <div
                key={b.id}
                className="rowh grid grid-cols-[1.4fr_1.2fr_1.2fr_1fr_.9fr] items-center gap-3 rounded-[10px] border-b border-[#F5F6F8] px-3 py-3.5"
              >
                <span className="truncate text-sm font-semibold">{b.hotel.name}</span>
                <span className="truncate text-[13.5px] text-[#6B7280]">
                  {b.guest.firstName} {b.guest.lastName}
                </span>
                <span className="text-[13.5px] font-medium text-[#374151]">{b.roomType.name}</span>
                <span className="text-[13.5px] text-[#6B7280]">
                  {formatShortDate(b.checkIn)} &ndash; {formatShortDate(b.checkOut)}
                </span>
                <span
                  className="w-fit rounded-full border px-2.5 py-1 text-xs font-bold"
                  style={{ color: st.c, background: st.bg, borderColor: st.bd }}
                >
                  {formatStatusLabel(b.status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
