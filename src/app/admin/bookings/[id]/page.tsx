import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, CreditCard, Building2 } from "lucide-react";
import { paymentStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import { getAdminBooking } from "@/lib/data/bookings";
import { formatCurrency } from "@/lib/pricing";
import { requireHotelOwnerSession } from "@/lib/session";
import { BookingHeader, MarkPaidButton } from "@/components/admin/booking-actions";
import { EditBookingButton } from "@/components/admin/edit-booking-button";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { hotelId } = await requireHotelOwnerSession();
  const booking = await getAdminBooking(id, hotelId);
  if (!booking) notFound();

  const latestPayment = booking.payments[0];
  const pay = paymentStatusTokens[latestPayment?.status ?? "PENDING"];
  const initials = `${booking.contactFirstName[0] ?? ""}${booking.contactLastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="fu max-w-[1000px] p-8">
      <Link
        href="/admin/bookings"
        className="navlink inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280]"
      >
        <ArrowLeft className="size-4" />
        Back to bookings
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <BookingHeader
          bookingId={booking.id}
          confirmationCode={booking.confirmationCode}
          status={booking.status}
        />
        <div className="mt-[18px] sm:mt-0">
          <EditBookingButton
            booking={{
              id: booking.id,
              confirmationCode: booking.confirmationCode,
              checkIn: toDateInputValue(booking.checkIn),
              checkOut: toDateInputValue(booking.checkOut),
              adults: booking.adults,
              children: booking.children,
              specialRequests: booking.specialRequests ?? "",
              contactFirstName: booking.contactFirstName,
              contactLastName: booking.contactLastName,
              contactEmail: booking.contactEmail,
              contactPhone: booking.contactPhone ?? "",
            }}
          />
        </div>
      </div>

      <div className="mt-[26px] grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-5">
          {/* GUEST */}
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <h2 className="mb-[18px] text-base font-bold">Guest information</h2>
            <div className="flex items-center gap-3.5">
              <div
                className="flex size-[52px] items-center justify-center rounded-full text-[17px] font-bold text-white"
                style={{ background: booking.roomType.gradient }}
              >
                {initials}
              </div>
              <div>
                <div className="text-[17px] font-bold">
                  {booking.contactFirstName} {booking.contactLastName}
                </div>
                <div className="mt-0.5 text-[13.5px] font-medium text-[#9CA3AF]">
                  {booking.guest._count.bookings > 1
                    ? `Returning guest · ${booking.guest._count.bookings} stays`
                    : "First-time guest"}
                </div>
              </div>
            </div>
            <div className="mt-[22px] grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2.5">
                <Mail className="size-[17px] text-[#9CA3AF]" />
                <span className="text-sm text-[#374151]">{booking.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-[17px] text-[#9CA3AF]" />
                <span className="text-sm text-[#374151]">{booking.contactPhone || "—"}</span>
              </div>
            </div>
          </div>

          {/* ROOM & DATES */}
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <h2 className="mb-[18px] text-base font-bold">Room &amp; dates</h2>
            <div className="flex gap-4">
              <div
                className="h-[84px] w-[110px] shrink-0 rounded-2xl"
                style={{ background: booking.roomType.gradient }}
              />
              <div className="flex-1">
                <div className="text-[17px] font-bold">{booking.roomType.name}</div>
                <div className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-[#9CA3AF]">
                  <Building2 className="size-[13px]" />
                  {booking.hotel.name} &middot; Room #{booking.roomUnit?.unitNumber ?? "unassigned"}
                </div>
                <div className="mt-4 flex flex-wrap gap-7">
                  <div>
                    <div className="text-xs font-semibold text-[#9CA3AF]">Check in</div>
                    <div className="mt-0.5 text-[14.5px] font-bold">{formatDate(booking.checkIn)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#9CA3AF]">Check out</div>
                    <div className="mt-0.5 text-[14.5px] font-bold">{formatDate(booking.checkOut)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#9CA3AF]">Guests</div>
                    <div className="mt-0.5 text-[14.5px] font-bold">
                      {booking.adults} adult{booking.adults === 1 ? "" : "s"}
                      {booking.children > 0 ? `, ${booking.children} children` : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <h2 className="mb-3.5 text-base font-bold">Special requests &amp; notes</h2>
            <div className="rounded-2xl bg-[#F7F8FA] p-4 text-sm leading-[1.6] text-[#4B5563]">
              {booking.specialRequests || "No special requests for this booking."}
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div
          className="sticky top-[92px] rounded-[20px] border border-[#E7E8EC] bg-white p-6"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">Payment</h2>
            <span
              className="rounded-full px-[11px] py-1.5 text-xs font-bold"
              style={{ color: pay.c, background: pay.bg }}
            >
              {formatStatusLabel(latestPayment?.status ?? "PENDING")}
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>
                Room &middot; {booking.nights} night{booking.nights === 1 ? "" : "s"}
              </span>
              <span className="font-semibold text-[#1F2937]">{formatCurrency(Number(booking.baseAmount))}</span>
            </div>
            {Number(booking.serviceFeeAmount) > 0 && (
              <div className="flex justify-between text-sm font-medium text-[#6B7280]">
                <span>Service fee</span>
                <span className="font-semibold text-[#1F2937]">{formatCurrency(Number(booking.serviceFeeAmount))}</span>
              </div>
            )}
            {Number(booking.taxAmount) > 0 && (
              <div className="flex justify-between text-sm font-medium text-[#6B7280]">
                <span>Taxes</span>
                <span className="font-semibold text-[#1F2937]">{formatCurrency(Number(booking.taxAmount))}</span>
              </div>
            )}
          </div>
          <div className="my-[18px] h-px bg-[#F0F1F4]" />
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-bold">Total</span>
            <span className="text-[22px] font-extrabold tracking-[-.02em]">
              {formatCurrency(Number(booking.totalAmount))}
            </span>
          </div>
          <div className="mt-[18px] flex items-center gap-2.5 rounded-xl bg-[#F7F8FA] px-3.5 py-3">
            <CreditCard className="size-[18px] text-[#6B7280]" />
            <span className="text-[13.5px] font-medium text-[#374151]">
              {latestPayment?.method === "PAY_AT_HOTEL"
                ? "Pay at hotel"
                : latestPayment?.cardLast4
                  ? `Card ending ${latestPayment.cardLast4}`
                  : "No payment recorded"}
            </span>
          </div>
          {latestPayment?.method === "PAY_AT_HOTEL" && (
            <MarkPaidButton bookingId={booking.id} paymentStatus={latestPayment.status} />
          )}
        </div>
      </div>
    </div>
  );
}
