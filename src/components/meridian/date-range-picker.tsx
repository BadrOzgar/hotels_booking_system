"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WEEKDAYS as weekdays, MONTHS as months, toIso, fromIso, isSameDay, buildMonthGrid } from "@/lib/calendar-grid";

function formatLabel(value: string) {
  return fromIso(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type Props = {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
};

export function DateRangePicker({ checkIn, checkOut, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const checkInDate = checkIn ? fromIso(checkIn) : null;
  const checkOutDate = checkOut ? fromIso(checkOut) : null;
  const [viewDate, setViewDate] = useState(() => {
    const base = checkInDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function handleSelect(day: Date) {
    if (day < today) return;

    if (!checkIn || (checkIn && checkOut)) {
      onChange(toIso(day), "");
      return;
    }

    if (checkInDate && day <= checkInDate) {
      onChange(toIso(day), "");
      return;
    }

    onChange(checkIn, toIso(day));
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());

  return (
    <div ref={rootRef} className="relative col-span-2 grid grid-cols-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-[15px] px-[18px] py-3.5 text-left"
      >
        <div className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
          Check in
        </div>
        <div className="mt-1.5 text-[15px] font-semibold text-[#1F2937]">
          {checkIn ? formatLabel(checkIn) : "Select date"}
        </div>
      </button>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-[15px] px-[18px] py-3.5 text-left"
        style={{ borderLeft: "1px solid #EEEFF2" }}
      >
        <div className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
          Check out
        </div>
        <div className="mt-1.5 text-[15px] font-semibold text-[#1F2937]">
          {checkOut ? formatLabel(checkOut) : "Select date"}
        </div>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+10px)] left-0 z-20 w-[320px] rounded-[20px] border border-[#E7E8EC] bg-white p-5"
          style={{ boxShadow: "0 16px 40px rgba(16,24,40,.14)" }}
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="flex size-7 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-[14px] font-bold">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="flex size-7 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {weekdays.map((d) => (
              <div key={d} className="pb-1 text-center text-[11px] font-bold text-[#9CA3AF]">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;

              const disabled = day < today;
              const isStart = checkInDate && isSameDay(day, checkInDate);
              const isEnd = checkOutDate && isSameDay(day, checkOutDate);
              const inRange =
                checkInDate && checkOutDate && day > checkInDate && day < checkOutDate;

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
                  className="flex aspect-square items-center justify-center rounded-[10px] text-[13px] font-semibold disabled:cursor-not-allowed"
                  style={style}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
