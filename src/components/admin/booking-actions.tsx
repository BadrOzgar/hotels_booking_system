"use client";

import { useState } from "react";
import { LogIn, LogOut, X } from "lucide-react";
import { bookingStatusTokens, type AdminBooking } from "@/lib/meridian-data";

export function BookingHeader({ booking }: { booking: AdminBooking }) {
  const [status, setStatus] = useState<AdminBooking["status"]>(booking.status);
  const st = bookingStatusTokens[status];

  const isCancelled = status === "Cancelled";
  const isCheckedOut = status === "Checked out";

  return (
    <div className="mt-[18px] flex flex-col items-start justify-between gap-4 sm:flex-row">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">{booking.id}</h1>
          <span
            className="rounded-full border px-3 py-[5px] text-xs font-bold"
            style={{ color: st.c, background: st.bg, borderColor: st.bd }}
          >
            {status}
          </span>
        </div>
        <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
          Booked Jun 2, 2026 &middot; via direct website
        </p>
      </div>
      <div className="flex gap-2.5">
        <button
          type="button"
          disabled={isCancelled || isCheckedOut}
          onClick={() => setStatus("Cancelled")}
          className="btns flex items-center gap-2 rounded-[13px] border border-[#F0D2D2] bg-white px-[18px] py-3 text-sm font-semibold text-[#D96A6A] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="size-4" />
          Cancel booking
        </button>
        <button
          type="button"
          disabled={isCancelled || isCheckedOut}
          onClick={() => setStatus("Checked out")}
          className="btns flex items-center gap-2 rounded-[13px] border border-[#E7E8EC] bg-white px-[18px] py-3 text-sm font-semibold text-[#1F2937] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <LogOut className="size-[17px]" />
          Check out
        </button>
        <button
          type="button"
          disabled={isCancelled || status === "Checked in" || isCheckedOut}
          onClick={() => setStatus("Checked in")}
          className="btnp flex items-center gap-2 rounded-[13px] px-[22px] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          <LogIn className="size-[17px]" />
          Check in guest
        </button>
      </div>
    </div>
  );
}
