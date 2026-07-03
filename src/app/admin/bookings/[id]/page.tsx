import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, CreditCard } from "lucide-react";
import {
  adminBookings,
  getAdminBooking,
  paymentStatusTokens,
} from "@/lib/meridian-data";
import { BookingHeader } from "@/components/admin/booking-actions";

export function generateStaticParams() {
  return adminBookings.map((b) => ({ id: b.id }));
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = getAdminBooking(id);
  if (!booking) notFound();

  const pay = paymentStatusTokens[booking.payment];

  return (
    <div className="fu max-w-[1000px] p-8">
      <Link
        href="/admin/bookings"
        className="navlink inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280]"
      >
        <ArrowLeft className="size-4" />
        Back to bookings
      </Link>

      <BookingHeader booking={booking} />

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
                style={{ background: booking.gradient }}
              >
                {booking.initials}
              </div>
              <div>
                <div className="text-[17px] font-bold">{booking.guest}</div>
                <div className="mt-0.5 text-[13.5px] font-medium text-[#9CA3AF]">
                  Returning guest &middot; 3 stays
                </div>
              </div>
            </div>
            <div className="mt-[22px] grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2.5">
                <Mail className="size-[17px] text-[#9CA3AF]" />
                <span className="text-sm text-[#374151]">amara@email.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-[17px] text-[#9CA3AF]" />
                <span className="text-sm text-[#374151]">+44 7700 900123</span>
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
              <div className="h-[84px] w-[110px] shrink-0 rounded-2xl" style={{ background: booking.gradient }} />
              <div className="flex-1">
                <div className="text-[17px] font-bold">{booking.room}</div>
                <div className="mt-0.5 text-[13px] font-medium text-[#9CA3AF]">
                  Room #{booking.num}
                </div>
                <div className="mt-4 flex flex-wrap gap-7">
                  <div>
                    <div className="text-xs font-semibold text-[#9CA3AF]">Check in</div>
                    <div className="mt-0.5 text-[14.5px] font-bold">{booking.cin}, 2026</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#9CA3AF]">Check out</div>
                    <div className="mt-0.5 text-[14.5px] font-bold">{booking.cout}, 2026</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#9CA3AF]">Guests</div>
                    <div className="mt-0.5 text-[14.5px] font-bold">{booking.guests} adults</div>
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
              Requested a high floor with an ocean-facing balcony and a late check-out if
              possible. Celebrating an anniversary — a small welcome touch would be
              appreciated.
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
              {booking.payment}
            </span>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Room &middot; 3 nights</span>
              <span className="font-semibold text-[#1F2937]">$1,260</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Service fee</span>
              <span className="font-semibold text-[#1F2937]">$48</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Taxes</span>
              <span className="font-semibold text-[#1F2937]">$151</span>
            </div>
          </div>
          <div className="my-[18px] h-px bg-[#F0F1F4]" />
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-bold">Total paid</span>
            <span className="text-[22px] font-extrabold tracking-[-.02em]">$1,459</span>
          </div>
          <div className="mt-[18px] flex items-center gap-2.5 rounded-xl bg-[#F7F8FA] px-3.5 py-3">
            <CreditCard className="size-[18px] text-[#6B7280]" />
            <span className="text-[13.5px] font-medium text-[#374151]">Visa ending 4242</span>
          </div>
        </div>
      </div>
    </div>
  );
}
