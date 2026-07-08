import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, BedDouble, CalendarCheck, DollarSign, Gauge } from "lucide-react";
import { getHotelForAdmin } from "@/lib/data/platform";
import { getHotel } from "@/lib/data/hotels";
import { listAmenities } from "@/lib/data/content";
import { hotelAccountStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import { formatCurrency } from "@/lib/pricing";
import { coverStyle } from "@/lib/media";
import { SuperAdminHotelActions } from "@/components/admin/super-admin-hotel-actions";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function SuperAdminHotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [admin, hotel, amenities] = await Promise.all([
    getHotelForAdmin(id),
    getHotel(id),
    listAmenities(),
  ]);
  if (!admin || !hotel) notFound();

  const st = hotelAccountStatusTokens[admin.accountStatus];

  const stats = [
    { icon: BedDouble, bg: "#EDFBF3", fg: "#4FB878", value: String(admin._count.roomUnits), label: "Rooms" },
    { icon: CalendarCheck, bg: "#EAF6FF", fg: "#3FA9F5", value: String(admin._count.bookings), label: "Bookings" },
    { icon: DollarSign, bg: "#FBF4EA", fg: "#D9A441", value: formatCurrency(admin.revenue), label: "Revenue" },
    { icon: Gauge, bg: "#F3F5FF", fg: "#7C8CF8", value: `${admin.occupancyRate}%`, label: "Occupancy" },
  ];

  return (
    <div className="fu mx-auto max-w-[1000px] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
        <Link href="/super-admin/hotels" className="navlink">Hotels</Link>
        <ChevronRight className="size-[15px]" />
        <span className="text-[#6B7280]">{admin.name}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div
            className="size-14 shrink-0 rounded-2xl bg-cover bg-center"
            style={coverStyle(hotel.images[0]?.url, admin.gradient)}
          />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="m-0 text-[26px] font-extrabold tracking-[-.03em]">{admin.name}</h1>
              <span
                className="w-fit rounded-full border px-2.5 py-1 text-xs font-bold"
                style={{ color: st.c, background: st.bg, borderColor: st.bd }}
              >
                {formatStatusLabel(admin.accountStatus)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-medium text-[#6B7280]">
              <MapPin className="size-[14px] text-[#9CA3AF]" />
              {admin.address}, {admin.city}, {admin.country}
            </div>
          </div>
        </div>

        <SuperAdminHotelActions
          hotelId={admin.id}
          accountStatus={admin.accountStatus}
          amenities={amenities.map((a) => ({ id: a.id, label: a.label }))}
          hotel={{
            name: hotel.name,
            description: hotel.description,
            city: hotel.city,
            country: hotel.country,
            address: hotel.address,
            starRating: hotel.starRating,
            currency: hotel.currency,
            checkInTime: hotel.checkInTime,
            checkOutTime: hotel.checkOutTime,
            serviceFeeCents: hotel.serviceFeeCents,
            taxRatePercent: Number(hotel.taxRatePercent),
            tag: hotel.tag,
            contactEmail: hotel.contactEmail,
            contactPhone: hotel.contactPhone,
            freeCancellationHours: hotel.cancellationPolicy?.freeCancellationHours ?? 48,
            penaltyNights: hotel.cancellationPolicy?.penaltyNights ?? 1,
            amenityIds: hotel.amenities.map((a) => a.amenityId),
            coverImageUrl: hotel.images[0]?.url ?? null,
          }}
        />
      </div>

      <div className="mt-[26px] grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[18px] border border-[#E7E8EC] bg-white p-5"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: s.bg }}>
              <s.icon className="size-5" style={{ color: s.fg }} />
            </div>
            <div className="mt-4 text-[22px] font-extrabold tracking-[-.02em]">{s.value}</div>
            <div className="mt-0.5 text-[13px] font-semibold text-[#9CA3AF]">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-[26px] grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div
          className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <h2 className="text-[15px] font-bold">Owner</h2>
          <dl className="mt-4 flex flex-col gap-3 text-[13.5px]">
            <Row label="Name" value={admin.owner.name ?? "—"} />
            <Row label="Email" value={admin.owner.email} />
            <Row label="Last login" value={admin.owner.lastLoginAt ? formatDateTime(admin.owner.lastLoginAt) : "Never"} />
            <Row label="Owner since" value={formatDate(admin.owner.createdAt)} />
          </dl>

          <h2 className="mt-6 text-[15px] font-bold">Subscription</h2>
          <dl className="mt-4 flex flex-col gap-3 text-[13.5px]">
            <Row label="Plan" value={formatStatusLabel(admin.subscription?.plan ?? "TRIAL")} />
            <Row label="Status" value={formatStatusLabel(admin.subscription?.status ?? "TRIALING")} />
            <Row label="Guests on file" value={String(admin._count.guests)} />
            <Row label="Hotel created" value={formatDate(admin.createdAt)} />
          </dl>
        </div>

        <div
          className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <h2 className="text-[15px] font-bold">Recent activity</h2>
          <div className="mt-4 flex flex-col gap-3.5">
            {admin.recentActivity.length === 0 && (
              <p className="text-[13.5px] font-medium text-[#9CA3AF]">No activity recorded yet.</p>
            )}
            {admin.recentActivity.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 border-b border-[#F5F6F8] pb-3.5 last:border-b-0 last:pb-0">
                <div>
                  <div className="text-[13.5px] font-semibold text-[#374151]">{formatStatusLabel(a.action)}</div>
                  {a.user?.name && <div className="text-[12.5px] font-medium text-[#9CA3AF]">{a.user.name}</div>}
                </div>
                <span className="shrink-0 text-[12.5px] font-medium text-[#9CA3AF]">{formatDateTime(a.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-medium text-[#9CA3AF]">{label}</dt>
      <dd className="font-semibold text-[#374151]">{value}</dd>
    </div>
  );
}
