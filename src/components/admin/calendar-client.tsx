"use client";

import { useMemo, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, LogIn, LogOut, X } from "lucide-react";
import { bookingStatusTokens, formatStatusLabel } from "@/lib/meridian-data";
import type { CalendarBookingEvent } from "@/lib/data/dashboard";
import { getMonthEvents } from "@/app/admin/calendar/actions";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MAX_VISIBLE_EVENTS = 3;

export function CalendarClient({
  initialYear,
  initialMonth,
  initialEvents,
  todayDate,
  todayYear,
  todayMonth,
}: {
  initialYear: number;
  initialMonth: number;
  initialEvents: Record<number, CalendarBookingEvent[]>;
  todayDate: number;
  todayYear: number;
  todayMonth: number;
}) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [eventsByDay, setEventsByDay] = useState(initialEvents);
  const [activeDay, setActiveDay] = useState<{ day: number; events: CalendarBookingEvent[] } | null>(null);
  const [pending, startTransition] = useTransition();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { day: number | ""; isToday: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: "", isToday: false });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, isToday: d === todayDate && month === todayMonth && year === todayYear });
    }
    return cells;
  }, [year, month, todayDate, todayMonth, todayYear]);

  function goToMonth(nextYear: number, nextMonth: number) {
    startTransition(async () => {
      const events = await getMonthEvents(nextYear, nextMonth);
      setYear(nextYear);
      setMonth(nextMonth);
      setEventsByDay(events);
      setActiveDay(null);
    });
  }

  function prevMonth() {
    const d = new Date(year, month - 1, 1);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  function nextMonth() {
    const d = new Date(year, month + 1, 1);
    goToMonth(d.getFullYear(), d.getMonth());
  }
  function goToday() {
    goToMonth(todayYear, todayMonth);
  }

  return (
    <div className="fu p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-.03em]">Calendar</h1>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            Check-ins and check-outs across all rooms.
          </p>
        </div>
        <button
          type="button"
          onClick={goToday}
          className="btns w-fit rounded-[13px] border border-[#E7E8EC] bg-white px-5 py-3 text-[14.5px] font-semibold text-[#1F2937]"
        >
          Today
        </button>
      </div>

      <div
        className="mt-[22px] rounded-[20px] border border-[#E7E8EC] bg-white p-6"
        style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)", opacity: pending ? 0.6 : 1 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-3 text-[12px] font-semibold text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <LogIn className="size-3.5 text-[#4FB878]" />
                Check-in
              </span>
              <span className="flex items-center gap-1.5">
                <LogOut className="size-3.5 text-[#E88A5A]" />
                Check-out
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevMonth}
                disabled={pending}
                aria-label="Previous month"
                className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC] disabled:opacity-50"
              >
                <ChevronLeft className="size-[15px] text-[#6B7280]" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                disabled={pending}
                aria-label="Next month"
                className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC] disabled:opacity-50"
              >
                <ChevronRight className="size-[15px] text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-[6px]">
          {weekdays.map((d) => (
            <div key={d} className="pb-1 text-center text-[12px] font-bold text-[#9CA3AF]">
              {d}
            </div>
          ))}
          {days.map((c, i) => {
            const events = c.day === "" ? [] : (eventsByDay[c.day] ?? []);
            const visible = events.slice(0, MAX_VISIBLE_EVENTS);
            const remaining = events.length - visible.length;

            return (
              <div
                key={i}
                className="flex min-h-[104px] flex-col gap-1 rounded-lg p-1.5 text-[13px] font-semibold"
                style={
                  c.day === ""
                    ? { color: "transparent" }
                    : { color: "#374151", background: "#fff", border: "1px solid #EEF0F4" }
                }
              >
                {c.day !== "" && (
                  <>
                    <span
                      className="flex size-6 items-center justify-center rounded-full"
                      style={c.isToday ? { background: "#7C8CF8", color: "#fff" } : undefined}
                    >
                      {c.day}
                    </span>
                    <div className="flex flex-col gap-1">
                      {visible.map((e, idx) => (
                        <div
                          key={`${e.bookingId}-${e.kind}-${idx}`}
                          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10.5px] font-semibold"
                          style={{
                            background: e.kind === "in" ? "#EDFBF3" : "#FFF3EC",
                            color: e.kind === "in" ? "#2F7F52" : "#B5602F",
                          }}
                        >
                          {e.kind === "in" ? (
                            <LogIn className="size-3 shrink-0" />
                          ) : (
                            <LogOut className="size-3 shrink-0" />
                          )}
                          <span className="truncate">{e.guestName}</span>
                        </div>
                      ))}
                      {remaining > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveDay({ day: c.day as number, events })}
                          className="cursor-pointer rounded-md px-1.5 py-1 text-left text-[10.5px] font-bold text-[#7C8CF8] hover:underline"
                        >
                          +{remaining} view more
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {activeDay && (
        <DayEventsModal
          day={activeDay.day}
          month={monthNames[month]}
          events={activeDay.events}
          onClose={() => setActiveDay(null)}
        />
      )}
    </div>
  );
}

function DayEventsModal({
  day,
  month,
  events,
  onClose,
}: {
  day: number;
  month: string;
  events: CalendarBookingEvent[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(16,24,40,.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[20px] bg-white p-6"
        style={{ boxShadow: "0 20px 50px rgba(16,24,40,.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold">
            {month} {day}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="ghost flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#E7E8EC]"
          >
            <X className="size-[15px] text-[#6B7280]" />
          </button>
        </div>
        <div className="mt-4 flex max-h-[360px] flex-col gap-2.5 overflow-y-auto">
          {events.map((e, idx) => {
            const st = bookingStatusTokens[e.status];
            return (
              <div
                key={`${e.bookingId}-${e.kind}-${idx}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#F0F1F4] px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: e.gradient }}
                  >
                    {e.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{e.guestName}</div>
                    <div className="text-xs text-[#9CA3AF]">{e.roomName}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="flex items-center gap-1 text-[11.5px] font-bold"
                    style={{ color: e.kind === "in" ? "#2F7F52" : "#B5602F" }}
                  >
                    {e.kind === "in" ? <LogIn className="size-3.5" /> : <LogOut className="size-3.5" />}
                    {e.kind === "in" ? "Check-in" : "Check-out"}
                  </span>
                  <span
                    className="rounded-full border px-2 py-[3px] text-[10.5px] font-bold"
                    style={{ color: st.c, background: st.bg, borderColor: st.bd }}
                  >
                    {formatStatusLabel(e.status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
