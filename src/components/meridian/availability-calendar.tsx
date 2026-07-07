"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function fromIso(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(viewYear: number, viewMonth: number) {
  const firstDay = new Date(viewYear, viewMonth, 1);
  const leadingBlanks = firstDay.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewYear, viewMonth, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function AvailabilityCalendar({
  pathname,
  checkIn,
  checkOut,
  unavailableDates,
  otherParams,
}: {
  pathname: string;
  checkIn: string;
  checkOut: string;
  unavailableDates: string[];
  otherParams: Record<string, string>;
}) {
  const router = useRouter();
  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const checkInDate = checkIn ? fromIso(checkIn) : null;
  const checkOutDate = checkOut ? fromIso(checkOut) : null;
  const [viewDate, setViewDate] = useState(() => {
    const base = checkInDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function updateDates(nextCheckIn: string, nextCheckOut: string) {
    const params = new URLSearchParams(otherParams);
    if (nextCheckIn) params.set("checkin", nextCheckIn);
    if (nextCheckOut) params.set("checkout", nextCheckOut);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function hasUnavailableBetween(start: Date, end: Date) {
    const cursor = new Date(start);
    while (cursor < end) {
      if (unavailableSet.has(toIso(cursor))) return true;
      cursor.setDate(cursor.getDate() + 1);
    }
    return false;
  }

  function handleSelect(day: Date) {
    if (day < today || unavailableSet.has(toIso(day))) return;

    if (!checkIn || (checkIn && checkOut)) {
      updateDates(toIso(day), "");
      return;
    }
    if (checkInDate && day <= checkInDate) {
      updateDates(toIso(day), "");
      return;
    }
    if (checkInDate && hasUnavailableBetween(checkInDate, day)) {
      // The range would cross a night that's already booked — start a fresh selection instead.
      updateDates(toIso(day), "");
      return;
    }
    updateDates(checkIn, toIso(day));
  }

  function shiftMonth(delta: number) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());

  return (
    <div
      className="mt-5 rounded-[20px] border border-[#E7E8EC] bg-white p-6"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-base font-bold">
          {months[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="mt-[18px] grid grid-cols-7 gap-1.5">
        {weekdays.map((d) => (
          <div key={d} className="pb-1.5 text-center text-xs font-bold text-[#9CA3AF]">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const unavailable = unavailableSet.has(toIso(day));
          const disabled = day < today || unavailable;
          const isStart = checkInDate && isSameDay(day, checkInDate);
          const isEnd = checkOutDate && isSameDay(day, checkOutDate);
          const inRange = checkInDate && checkOutDate && day > checkInDate && day < checkOutDate;

          let style: React.CSSProperties = { color: "#374151", background: "#fff", border: "1px solid #EEF0F4" };
          if (disabled) {
            style = { color: "#C7CAD2", background: "#F4F5F7", border: "1px solid transparent" };
          } else if (isStart || isEnd) {
            style = { color: "#fff", background: "#7C8CF8", border: "1px solid #7C8CF8" };
          } else if (inRange) {
            style = { color: "#4A5AE0", background: "#EEF1FF", border: "1px solid #C9D1FB" };
          }

          return (
            <button
              type="button"
              key={i}
              disabled={disabled}
              onClick={() => handleSelect(day)}
              className="flex aspect-square cursor-pointer items-center justify-center rounded-[10px] text-[13.5px] font-semibold disabled:cursor-not-allowed"
              style={style}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <div className="mt-[18px] flex gap-5 border-t border-[#F0F1F4] pt-4 text-[12.5px] font-medium text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-[#EEF1FF]" style={{ border: "1px solid #C9D1FB" }} />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-white" style={{ border: "1px solid #E7E8EC" }} />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[4px] bg-[#F4F5F7]" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
