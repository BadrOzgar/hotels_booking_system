"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TrendingUp, DoorOpen, BedDouble, LogIn, LogOut, CalendarClock } from "lucide-react";
import {
  weekdays,
  buildCalendar,
  revenueBars,
  bookingStatusTokens,
  type AdminBooking,
} from "@/lib/meridian-data";

const statIcons = {
  door: DoorOpen,
  bed: BedDouble,
  login: LogIn,
  logout: LogOut,
  calendar: CalendarClock,
};

type Stat = {
  icon: keyof typeof statIcons;
  bg: string;
  fg: string;
  value: string;
  label: string;
};

const on = { background: "#fff", color: "#1F2937" };
const off = { background: "transparent", color: "#9CA3AF" };

type Range = "7D" | "30D" | "1Y";

const revenueTotals: Record<Range, string> = {
  "7D": "$96,420",
  "30D": "$412,860",
  "1Y": "$4.86M",
};

const revenueDeltas: Record<Range, string> = {
  "7D": "↑ 14%",
  "30D": "↑ 9%",
  "1Y": "↑ 22%",
};

export function DashboardToggle({
  recentBookings,
  stats,
}: {
  recentBookings: AdminBooking[];
  stats: Stat[];
}) {
  const [variant, setVariant] = useState<"overview" | "performance">("overview");
  const [range, setRange] = useState<Range>("7D");
  const calendar = buildCalendar();

  const scaledBars = useMemo(() => {
    const factor = range === "7D" ? 1 : range === "30D" ? 0.72 : 0.5;
    return revenueBars.map((bar) => {
      const pct = parseFloat(bar.h);
      const scaled = Math.max(18, Math.round(pct * factor));
      return { ...bar, h: `${scaled}%` };
    });
  }, [range]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Good morning, Elena</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            Here&apos;s what&apos;s happening at Meridian today &middot; Thursday, June 12
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-[#9CA3AF]">Layout</span>
          <div className="flex gap-1 rounded-[11px] border border-[#E7E8EC] bg-[#F4F5F7] p-1">
            <button
              type="button"
              onClick={() => setVariant("overview")}
              style={variant === "overview" ? on : off}
              className="rounded-lg px-[13px] py-1.5 text-[13px] font-semibold"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setVariant("performance")}
              style={variant === "performance" ? on : off}
              className="rounded-lg px-[13px] py-1.5 text-[13px] font-semibold"
            >
              Performance
            </button>
          </div>
        </div>
      </div>

      <div className="mt-[26px] grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => {
          const Icon = statIcons[s.icon];
          return (
            <div
              key={s.label}
              className="lift rounded-[18px] border border-[#E7E8EC] bg-white p-5"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <div
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ background: s.bg }}
                suppressHydrationWarning
              >
                <Icon className="size-5" style={{ color: s.fg }} />
              </div>
              <div className="mt-4 text-[28px] font-extrabold tracking-[-.02em]">{s.value}</div>
              <div className="mt-0.5 text-[13px] font-semibold text-[#9CA3AF]">{s.label}</div>
            </div>
          );
        })}
        <div
          className="rounded-[18px] p-5"
          style={{ background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)", boxShadow: "0 8px 22px rgba(124,140,248,.28)" }}
        >
          <div className="flex size-10 items-center justify-center rounded-xl bg-white/22">
            <TrendingUp className="size-5 text-white" />
          </div>
          <div className="mt-4 text-[28px] font-extrabold tracking-[-.02em] text-white">$14.2k</div>
          <div className="mt-0.5 text-[13px] font-semibold text-white/85">Revenue today</div>
        </div>
      </div>

      {variant === "overview" ? (
        <div className="fu mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold">Recent bookings</h2>
              <Link href="/admin/bookings" className="navlink text-[13px] font-semibold text-[#7C8CF8]">
                View all
              </Link>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-[1.6fr_1.2fr_1fr_.9fr] gap-3 border-b border-[#F0F1F4] px-3 pb-3 text-xs font-bold tracking-[.04em] text-[#9CA3AF] uppercase">
                <span>Guest</span>
                <span>Room</span>
                <span>Dates</span>
                <span>Status</span>
              </div>
              {recentBookings.map((b) => {
                const st = bookingStatusTokens[b.status];
                return (
                  <div
                    key={b.id}
                    className="rowh grid grid-cols-[1.6fr_1.2fr_1fr_.9fr] items-center gap-3 rounded-[10px] border-b border-[#F5F6F8] px-3 py-3.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex size-[34px] shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: b.gradient }}
                      >
                        {b.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{b.guest}</div>
                        <div className="text-xs text-[#9CA3AF]">{b.id}</div>
                      </div>
                    </div>
                    <span className="text-[13.5px] font-medium text-[#374151]">{b.room}</span>
                    <span className="text-[13.5px] text-[#6B7280]">{b.cin} &ndash; {b.cout}</span>
                    <span
                      className="w-fit rounded-full border px-2.5 py-1 text-xs font-bold"
                      style={{ color: st.c, background: st.bg, borderColor: st.bd }}
                    >
                      {b.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <h2 className="text-[17px] font-bold">June 2026</h2>
            <div className="mt-[18px] grid grid-cols-7 gap-[5px]">
              {weekdays.map((d) => (
                <div key={d} className="pb-1 text-center text-[11px] font-bold text-[#9CA3AF]">
                  {d}
                </div>
              ))}
              {calendar.map((c, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-lg text-[12.5px] font-semibold"
                  style={{ color: c.color, background: c.bg, border: c.border }}
                >
                  {c.day}
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-[#F0F1F4] pt-[18px]">
              <div className="flex items-center justify-between text-[13px] font-semibold text-[#6B7280]">
                <span>Occupancy this week</span>
                <span className="font-extrabold text-[#1F2937]">78%</span>
              </div>
              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#EDEEF2]">
                <div
                  className="h-full rounded-full"
                  style={{ width: "78%", background: "linear-gradient(90deg,#7C8CF8,#8FD3FE)" }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fu mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-[17px] font-bold">Revenue</h2>
                <div className="mt-2 text-[28px] font-extrabold tracking-[-.02em]">
                  {revenueTotals[range]}{" "}
                  <span className="rounded-full bg-[#EDFBF3] px-2.5 py-[3px] align-middle text-[13px] font-bold text-[#4FB878]">
                    {revenueDeltas[range]}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 rounded-[10px] border border-[#E7E8EC] bg-[#F4F5F7] p-[3px]">
                {(["7D", "30D", "1Y"] as const).map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRange(r)}
                    className="cursor-pointer rounded-[7px] px-[11px] py-[5px] text-xs font-semibold"
                    style={
                      range === r
                        ? { background: "#fff", color: "#1F2937", boxShadow: "0 1px 2px rgba(16,24,40,.08)" }
                        : { color: "#9CA3AF" }
                    }
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-[26px] flex h-[170px] items-end gap-3 pt-2.5">
              {scaledBars.map((bar) => (
                <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div
                    className="w-full rounded-t-lg rounded-b-[4px]"
                    style={{ height: bar.h, background: bar.fill }}
                  />
                  <span className="text-[11.5px] font-semibold text-[#9CA3AF]">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div
              className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <h2 className="mb-[18px] text-[17px] font-bold">Occupancy rate</h2>
              <div className="flex items-center gap-5">
                <div
                  className="flex size-24 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "conic-gradient(#7C8CF8 0% 78%,#EDEEF2 78% 100%)" }}
                >
                  <div className="flex size-[70px] items-center justify-center rounded-full bg-white text-xl font-extrabold">
                    78%
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                    <span className="size-2.5 rounded-[3px] bg-[#7C8CF8]" />
                    Occupied &middot; 24 rooms
                  </div>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#6B7280]">
                    <span className="size-2.5 rounded-[3px] bg-[#EDEEF2]" />
                    Available &middot; 18 rooms
                  </div>
                </div>
              </div>
            </div>
            <div
              className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <h2 className="mb-4 text-[17px] font-bold">Key metrics</h2>
              <div className="flex flex-col gap-[14px]">
                <KeyMetric label="Avg. daily rate" value="$342" />
                <KeyMetric label="RevPAR" value="$267" />
                <KeyMetric label="Avg. length of stay" value="3.4 nights" />
                <KeyMetric label="Direct bookings" value="64%" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KeyMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-[#6B7280]">{label}</span>
      <span className="text-[15px] font-bold">{value}</span>
    </div>
  );
}
