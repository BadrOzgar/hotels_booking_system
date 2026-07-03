"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Download, ChevronRight } from "lucide-react";
import { adminBookings, bookingStatusTokens, paymentStatusTokens } from "@/lib/meridian-data";

const filters = ["All", "Confirmed", "Pending", "Checked in", "Checked out", "Cancelled"] as const;
const paymentFilters = ["All", "Paid", "Pending", "Refunded"] as const;

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<(typeof filters)[number]>("All");
  const [paymentFilter, setPaymentFilter] = useState<(typeof paymentFilters)[number]>("All");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const pending = adminBookings.filter((b) => b.status === "Pending").length;

  const filtered = useMemo(() => {
    return adminBookings.filter((b) => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (paymentFilter !== "All" && b.payment !== paymentFilter) return false;
      return true;
    });
  }, [statusFilter, paymentFilter]);

  function exportCsv() {
    const header = ["Booking", "Guest", "Room", "Check in", "Check out", "Guests", "Status", "Payment"];
    const rows = filtered.map((b) => [b.id, b.guest, b.room, b.cin, b.cout, String(b.guests), b.status, b.payment]);
    const csv = [header, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fu p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Bookings</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            {adminBookings.length} total &middot; {pending} awaiting approval
          </p>
        </div>
        <div className="relative flex gap-2.5">
          <button
            type="button"
            onClick={() => setShowFilterPanel((v) => !v)}
            className="btns flex items-center gap-2 rounded-[13px] border border-[#E7E8EC] bg-white px-[18px] py-[11px] text-sm font-semibold"
          >
            <SlidersHorizontal className="size-4 text-[#6B7280]" />
            Filter
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className="btns flex items-center gap-2 rounded-[13px] border border-[#E7E8EC] bg-white px-[18px] py-[11px] text-sm font-semibold"
          >
            <Download className="size-4 text-[#6B7280]" />
            Export
          </button>
          {showFilterPanel && (
            <div
              className="absolute top-[calc(100%+8px)] right-0 z-10 w-[220px] rounded-2xl border border-[#E7E8EC] bg-white p-4"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.12)" }}
            >
              <div className="text-[13px] font-bold text-[#374151]">Payment status</div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {paymentFilters.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPaymentFilter(p)}
                    className="cursor-pointer rounded-[9px] border px-3 py-[6px] text-[12.5px] font-semibold"
                    style={
                      paymentFilter === p
                        ? { borderColor: "#7C8CF8", background: "#F3F5FF", color: "#4A5AE0" }
                        : { borderColor: "#E7E8EC", color: "#6B7280" }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-[22px] flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            type="button"
            key={f}
            onClick={() => setStatusFilter(f)}
            className="cursor-pointer rounded-[11px] border px-[15px] py-2 text-[13px] font-semibold"
            style={
              statusFilter === f
                ? { background: "#fff", borderColor: "#7C8CF8", color: "#4A5AE0" }
                : { background: "#fff", borderColor: "#E7E8EC", color: "#6B7280" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div
        className="mt-5 overflow-hidden rounded-[20px] border border-[#E7E8EC] bg-white"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
      >
        <div className="hidden grid-cols-[1fr_1.4fr_1.1fr_1.2fr_.7fr_1fr_.9fr_70px] gap-3.5 bg-[#FBFBFC] px-6 py-4 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase lg:grid">
          <span>Booking</span>
          <span>Guest</span>
          <span>Room</span>
          <span>Dates</span>
          <span>Guests</span>
          <span>Status</span>
          <span>Payment</span>
          <span />
        </div>
        {filtered.length === 0 && (
          <div className="px-6 py-14 text-center text-[14px] font-medium text-[#9CA3AF]">
            No bookings match these filters.
          </div>
        )}
        {filtered.map((b) => {
          const st = bookingStatusTokens[b.status];
          const pay = paymentStatusTokens[b.payment];
          return (
            <Link
              key={b.id}
              href={`/admin/bookings/${b.id}`}
              className="rowh grid grid-cols-2 items-center gap-3.5 border-b border-[#F5F6F8] px-6 py-[15px] last:border-b-0 lg:grid-cols-[1fr_1.4fr_1.1fr_1.2fr_.7fr_1fr_.9fr_70px]"
            >
              <span className="text-[13.5px] font-bold text-[#4A5AE0]">{b.id}</span>
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: b.gradient }}
                >
                  {b.initials}
                </div>
                <span className="truncate text-sm font-semibold">{b.guest}</span>
              </div>
              <div>
                <div className="text-[13.5px] font-semibold">{b.room}</div>
                <div className="text-xs text-[#9CA3AF]">#{b.num}</div>
              </div>
              <span className="text-[13.5px] text-[#6B7280]">{b.cin} &ndash; {b.cout}</span>
              <span className="text-[13.5px] text-[#6B7280]">{b.guests}</span>
              <span
                className="w-fit rounded-full border px-[11px] py-1.5 text-xs font-bold"
                style={{ color: st.c, background: st.bg, borderColor: st.bd }}
              >
                {b.status}
              </span>
              <span
                className="w-fit rounded-full px-[11px] py-1.5 text-xs font-bold"
                style={{ color: pay.c, background: pay.bg }}
              >
                {b.payment}
              </span>
              <span className="ghost hidden size-8 items-center justify-center rounded-lg justify-self-end lg:flex">
                <ChevronRight className="size-[17px] text-[#9CA3AF]" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
