"use client";

import { useActionState } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { PayAtHotelNotice } from "@/components/meridian/pay-at-hotel-notice";
import { formatCurrency } from "@/lib/pricing";
import { coverStyle } from "@/lib/media";
import { createBookingAction } from "@/app/(site)/booking/[id]/actions";

export function BookingForm({
  roomTypeId,
  roomName,
  roomCategory,
  gradient,
  coverImageUrl,
  rating,
  checkIn,
  checkOut,
  checkInLabel,
  checkOutLabel,
  adults,
  childCount,
  nights,
  pricePerNight,
  base,
  serviceFee,
  tax,
  total,
}: {
  roomTypeId: string;
  roomName: string;
  roomCategory: string;
  gradient: string;
  coverImageUrl: string | null;
  rating: number;
  checkIn: string;
  checkOut: string;
  checkInLabel: string;
  checkOutLabel: string;
  adults: number;
  childCount: number;
  nights: number;
  pricePerNight: number;
  base: number;
  serviceFee: number;
  tax: number;
  total: number;
}) {
  const [error, formAction, pending] = useActionState(createBookingAction, undefined);

  return (
    <form action={formAction}>
      <input type="hidden" name="roomTypeId" value={roomTypeId} />
      <input type="hidden" name="checkIn" value={checkIn} />
      <input type="hidden" name="checkOut" value={checkOut} />
      <input type="hidden" name="adults" value={adults} />
      <input type="hidden" name="children" value={childCount} />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
        {/* FORM */}
        <div
          className="rounded-[22px] border border-[#E7E8EC] bg-white p-[30px]"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <h2 className="text-xl font-bold tracking-[-.02em]">Guest information</h2>
          <div className="mt-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            <Field label="First name" name="firstName" defaultValue="Amara" />
            <Field label="Last name" name="lastName" defaultValue="Okafor" />
            <Field label="Email" name="email" type="email" defaultValue="amara@email.com" />
            <Field label="Phone" name="phone" defaultValue="+44 7700 900123" required={false} />
          </div>
          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">
              Special requests <span className="font-medium text-[#9CA3AF]">(optional)</span>
            </label>
            <textarea
              name="specialRequests"
              placeholder="Late check-in, dietary needs, a special occasion…"
              className="mt-2 min-h-[88px] w-full resize-none rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
            />
          </div>

          <div className="my-[26px] h-px bg-[#F0F1F4]" />
          <h2 className="text-xl font-bold tracking-[-.02em]">Payment method</h2>
          <PayAtHotelNotice />
        </div>

        {/* SUMMARY */}
        <div
          className="sticky top-[92px] rounded-[22px] border border-[#E7E8EC] bg-white p-6"
          style={{ boxShadow: "0 12px 30px rgba(16,24,40,.08)" }}
        >
          <div className="flex gap-3.5">
            <div className="size-[76px] shrink-0 rounded-2xl bg-cover bg-center" style={coverStyle(coverImageUrl, gradient)} />
            <div>
              <div className="text-base font-bold tracking-[-.01em]">{roomName}</div>
              <div className="mt-[3px] text-[13px] font-medium text-[#9CA3AF]">{roomCategory}</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Star className="size-[13px] fill-[#F6D68A] text-[#F6D68A]" />
                <span className="text-[12.5px] font-bold">{rating || "New"}</span>
              </div>
            </div>
          </div>
          <div className="my-5 h-px bg-[#F0F1F4]" />
          <div className="flex flex-col gap-3">
            <SummaryRow label="Dates" value={`${checkInLabel} – ${checkOutLabel}`} />
            <SummaryRow label="Guests" value={`${adults} adults${childCount > 0 ? `, ${childCount} children` : ""}`} />
            <SummaryRow label="Nights" value={String(nights)} />
          </div>
          <div className="my-5 h-px bg-[#F0F1F4]" />
          <div className="flex flex-col gap-[11px]">
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>
                {formatCurrency(pricePerNight)} &times; {nights} nights
              </span>
              <span className="font-semibold text-[#1F2937]">{formatCurrency(base)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Service fee</span>
              <span className="font-semibold text-[#1F2937]">{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Taxes</span>
              <span className="font-semibold text-[#1F2937]">{formatCurrency(tax)}</span>
            </div>
          </div>
          <div className="my-[18px] h-px bg-[#F0F1F4]" />
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-bold">Total</span>
            <span className="text-2xl font-extrabold tracking-[-.02em]">{formatCurrency(total)}</span>
          </div>

          {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="btnp mt-5 block w-full rounded-[15px] py-4 text-center text-base font-bold text-white disabled:opacity-60"
            style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
          >
            {pending ? "Confirming…" : "Confirm booking"}
          </button>
          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#9CA3AF]">
            <ShieldCheck className="size-3.5" />
            Secured &middot; Free cancellation
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-medium text-[#6B7280]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
