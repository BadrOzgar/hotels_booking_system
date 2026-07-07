"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, X, Banknote } from "lucide-react";
import { bookingStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import { updateBookingStatusAction, markPaymentPaidAction } from "@/app/admin/bookings/actions";
import type { BookingStatus } from "@/generated/prisma/enums";

export function BookingHeader({
  bookingId,
  confirmationCode,
  status: initialStatus,
  children,
}: {
  bookingId: string;
  confirmationCode: string;
  status: BookingStatus;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<BookingStatus>(initialStatus);
  const [pending, startTransition] = useTransition();
  const st = bookingStatusTokens[status];

  const isCancelled = status === "CANCELLED";
  const isCheckedOut = status === "CHECKED_OUT";

  function transition(next: BookingStatus) {
    startTransition(async () => {
      await updateBookingStatusAction(bookingId, next);
      setStatus(next);
      router.refresh();
    });
  }

  return (
    <div className="mt-[18px] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">{confirmationCode}</h1>
        <span
          className="rounded-full border px-3 py-[5px] text-xs font-bold"
          style={{ color: st.c, background: st.bg, borderColor: st.bd }}
        >
          {formatStatusLabel(status)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 rounded-[14px] border border-[#E7E8EC] bg-white p-1.5">
        <button
          type="button"
          disabled={pending || isCancelled || isCheckedOut}
          onClick={() => transition("CANCELLED")}
          className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-[7px] text-[12.5px] font-semibold text-[#D96A6A] hover:bg-[#FDEEEE] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <X className="size-[13px]" />
          Cancel
        </button>
        <button
          type="button"
          disabled={pending || isCancelled || isCheckedOut}
          onClick={() => transition("CHECKED_OUT")}
          className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-[7px] text-[12.5px] font-semibold text-[#374151] hover:bg-[#F4F5F7] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <LogOut className="size-[13px]" />
          Check out
        </button>
        <button
          type="button"
          disabled={pending || isCancelled || status === "CHECKED_IN" || isCheckedOut}
          onClick={() => transition("CHECKED_IN")}
          className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3.5 py-[7px] text-[12.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          style={{ background: "#7C8CF8" }}
        >
          <LogIn className="size-[13px]" />
          Check in
        </button>
        {children && (
          <>
            <div className="mx-0.5 h-6 w-px bg-[#E7E8EC]" />
            {children}
          </>
        )}
      </div>
    </div>
  );
}

/** Lets front desk mark a pay-at-hotel payment as collected once the guest settles their bill. */
export function MarkPaidButton({ bookingId, paymentStatus }: { bookingId: string; paymentStatus: string }) {
  const router = useRouter();
  const [paid, setPaid] = useState(paymentStatus === "PAID");
  const [pending, startTransition] = useTransition();

  if (paid) return null;

  function handleClick() {
    startTransition(async () => {
      await markPaymentPaidAction(bookingId);
      setPaid(true);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={handleClick}
      className="btnp mt-[14px] flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13.5px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      style={{ background: "#4FB878", boxShadow: "0 4px 14px rgba(79,184,120,.28)" }}
    >
      <Banknote className="size-4" />
      {pending ? "Marking as paid…" : "Mark as paid"}
    </button>
  );
}
