import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Download } from "lucide-react";
import { getBookingByConfirmationCode } from "@/lib/data/bookings";
import { formatCurrency } from "@/lib/pricing";

function formatDateTime(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default async function BookingConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: confirmationCode } = await searchParams;
  const booking = confirmationCode ? await getBookingByConfirmationCode(confirmationCode) : undefined;
  if (!booking) notFound();

  return (
    <div className="fu mx-auto max-w-[620px] px-8 pt-[70px] pb-[90px] text-center">
      <div
        className="mx-auto flex size-[88px] items-center justify-center rounded-full"
        style={{
          background: "linear-gradient(135deg,#8DD7A5,#A8E6CF)",
          boxShadow: "0 12px 30px rgba(141,215,165,.4)",
        }}
      >
        <Check className="size-11 text-white" strokeWidth={2.4} />
      </div>
      <h1 className="mt-7 text-4xl font-extrabold tracking-[-.03em]">
        You&apos;re all set, {booking.contactFirstName}
      </h1>
      <p className="mt-3.5 text-[17px] leading-[1.6] text-[#6B7280]">
        Your reservation is confirmed. We&apos;ve sent the details and directions to{" "}
        <span className="font-semibold text-[#1F2937]">{booking.contactEmail}</span>. We can&apos;t wait
        to welcome you.
      </p>

      <div
        className="mt-9 rounded-[22px] border border-[#E7E8EC] bg-white p-7 text-left"
        style={{ boxShadow: "0 12px 30px rgba(16,24,40,.06)" }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
            Booking reference
          </div>
          <div className="text-xl font-extrabold tracking-[.06em] text-[#7C8CF8]">
            {booking.confirmationCode}
          </div>
        </div>
        <div className="my-[22px] h-px bg-[#F0F1F4]" />
        <div className="flex gap-4">
          <div className="size-[88px] shrink-0 rounded-2xl" style={{ background: booking.roomType.gradient }} />
          <div className="flex-1">
            <div className="text-[19px] font-bold tracking-[-.02em]">{booking.roomType.name}</div>
            <div className="mt-[3px] text-[13.5px] font-medium text-[#9CA3AF]">
              {booking.hotel.name} &middot; {booking.hotel.city}
            </div>
            <div className="mt-4 flex gap-6">
              <div>
                <div className="text-xs font-semibold text-[#9CA3AF]">Check in</div>
                <div className="mt-0.5 text-[15px] font-bold">{formatDateTime(booking.checkIn)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#9CA3AF]">Check out</div>
                <div className="mt-0.5 text-[15px] font-bold">{formatDateTime(booking.checkOut)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#9CA3AF]">Total</div>
                <div className="mt-0.5 text-[15px] font-bold">{formatCurrency(Number(booking.totalAmount))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-7 flex justify-center gap-3">
        <button
          type="button"
          className="btns flex items-center gap-2 rounded-2xl border border-[#E7E8EC] bg-white px-[22px] py-3.5 text-[15px] font-semibold text-[#1F2937]"
        >
          <Download className="size-[17px]" />
          Download receipt
        </button>
        <Link
          href="/"
          className="btnp rounded-2xl px-6 py-3.5 text-[15px] font-semibold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
