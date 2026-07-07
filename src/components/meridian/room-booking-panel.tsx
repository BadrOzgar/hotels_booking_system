"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Users, Lock } from "lucide-react";
import { WEEKDAYS, MONTHS, toIso, fromIso, isSameDay, buildMonthGrid } from "@/lib/calendar-grid";
import { computePricing, nightsBetween, formatCurrency } from "@/lib/pricing";
import { GuestStepper } from "./guest-stepper";

function formatDate(value: string) {
  return fromIso(value).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RoomBookingPanel({
  roomId,
  pricePerNight,
  unavailableDates,
  initialCheckIn,
  initialCheckOut,
  initialAdults,
  initialChildren,
  initialInfants,
  initialPets,
  roomsCount,
}: {
  roomId: string;
  pricePerNight: number;
  unavailableDates: string[];
  initialCheckIn: string;
  initialCheckOut: string;
  initialAdults: number;
  initialChildren: number;
  initialInfants: number;
  initialPets: number;
  roomsCount: number;
}) {
  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);

  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [adults, setAdults] = useState(initialAdults);
  const [children, setChildren] = useState(initialChildren);
  const [infants, setInfants] = useState(initialInfants);
  const [pets, setPets] = useState(initialPets);

  const [datesOpen, setDatesOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const datesRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLDivElement>(null);

  const checkInDate = checkIn ? fromIso(checkIn) : null;
  const checkOutDate = checkOut ? fromIso(checkOut) : null;
  const [viewDate, setViewDate] = useState(() => {
    const base = checkInDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (datesRef.current && !datesRef.current.contains(e.target as Node)) setDatesOpen(false);
      if (whoRef.current && !whoRef.current.contains(e.target as Node)) setWhoOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasValidRange = Boolean(checkInDate && checkOutDate && checkOutDate > checkInDate);
  const nights = hasValidRange ? nightsBetween(new Date(`${checkIn}T15:00:00`), new Date(`${checkOut}T11:00:00`)) : 0;
  // Guest checkout is pay-at-hotel only — fees/taxes are settled with the front desk, not charged here.
  const pricing = computePricing({ pricePerNight, nights, serviceFeeCents: 0, taxRatePercent: 0 });

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
      setCheckIn(toIso(day));
      setCheckOut("");
      return;
    }
    if (checkInDate && day <= checkInDate) {
      setCheckIn(toIso(day));
      setCheckOut("");
      return;
    }
    if (checkInDate && hasUnavailableBetween(checkInDate, day)) {
      setCheckIn(toIso(day));
      setCheckOut("");
      return;
    }
    setCheckOut(toIso(day));
    setDatesOpen(false);
  }

  function shiftMonth(delta: number) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  const cells = buildMonthGrid(viewDate.getFullYear(), viewDate.getMonth());

  const guestSummary = [
    `${adults} adult${adults === 1 ? "" : "s"}`,
    children > 0 ? `${children} child${children === 1 ? "" : "ren"}` : null,
    infants > 0 ? `${infants} infant${infants === 1 ? "" : "s"}` : null,
    pets > 0 ? `${pets} pet${pets === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const bookHref = (() => {
    const params = new URLSearchParams({
      adults: String(adults),
      children: String(children),
      rooms: String(roomsCount),
    });
    if (hasValidRange) {
      params.set("checkin", checkIn);
      params.set("checkout", checkOut);
    }
    if (infants > 0) params.set("infants", String(infants));
    if (pets > 0) params.set("pets", String(pets));
    return `/booking/${roomId}?${params.toString()}`;
  })();

  return (
    <div
      className="sticky top-[92px] rounded-[22px] border border-[#E7E8EC] bg-white p-[26px]"
      style={{ boxShadow: "0 12px 30px rgba(16,24,40,.08)" }}
    >
      <div className="flex items-baseline gap-1.5">
        <span className="text-[30px] font-extrabold tracking-[-.02em]">{formatCurrency(pricePerNight)}</span>
        <span className="text-[15px] font-medium text-[#9CA3AF]">/ night</span>
      </div>

      <div ref={datesRef} className="relative mt-5">
        <button
          type="button"
          onClick={() => {
            setDatesOpen((v) => !v);
            setWhoOpen(false);
          }}
          className="grid w-full cursor-pointer grid-cols-2 overflow-hidden rounded-2xl border border-[#E7E8EC] text-left"
        >
          <div className="border-r border-[#E7E8EC] px-4 py-3.5">
            <div className="text-[11.5px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Check in</div>
            <div className="mt-1 text-[14.5px] font-semibold">{checkIn ? formatDate(checkIn) : "Select date"}</div>
          </div>
          <div className="px-4 py-3.5">
            <div className="text-[11.5px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Check out</div>
            <div className="mt-1 text-[14.5px] font-semibold">{checkOut ? formatDate(checkOut) : "Select date"}</div>
          </div>
        </button>

        {datesOpen && (
          <div
            className="absolute top-[calc(100%+10px)] left-0 z-20 w-full min-w-[320px] rounded-[20px] border border-[#E7E8EC] bg-white p-5"
            style={{ boxShadow: "0 16px 40px rgba(16,24,40,.14)" }}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-[14px] font-bold">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F4F5F7]"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map((d) => (
                <div key={d} className="pb-1 text-center text-[11px] font-bold text-[#9CA3AF]">
                  {d}
                </div>
              ))}
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;

                const iso = toIso(day);
                const isPast = day < today;
                const isUnavailable = !isPast && unavailableSet.has(iso);
                const disabled = isPast || isUnavailable;
                const isStart = checkInDate && isSameDay(day, checkInDate);
                const isEnd = checkOutDate && isSameDay(day, checkOutDate);
                const inRange = checkInDate && checkOutDate && day > checkInDate && day < checkOutDate;

                let style: React.CSSProperties = { color: "#374151", background: "#fff", border: "1px solid #EEF0F4" };
                if (isPast) {
                  style = { color: "#C7CAD2", background: "#F4F5F7", border: "1px solid transparent" };
                } else if (isUnavailable) {
                  style = {
                    color: "#B7BAC2",
                    background: "#F4F5F7",
                    border: "1px solid transparent",
                    textDecoration: "line-through",
                  };
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
                    title={isUnavailable ? "Already booked" : undefined}
                    className="flex aspect-square cursor-pointer items-center justify-center rounded-[10px] text-[13px] font-semibold disabled:cursor-not-allowed"
                    style={style}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-4 border-t border-[#F0F1F4] pt-3.5 text-[12px] font-medium text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[4px] bg-[#7C8CF8]" />
                Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[4px] bg-white" style={{ border: "1px solid #E7E8EC" }} />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-[4px] bg-[#F4F5F7]" style={{ textDecoration: "line-through" }} />
                Unavailable
              </span>
            </div>
          </div>
        )}
      </div>

      <div ref={whoRef} className="relative mt-3">
        <button
          type="button"
          onClick={() => {
            setWhoOpen((v) => !v);
            setDatesOpen(false);
          }}
          className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#E7E8EC] px-4 py-3.5 text-left"
        >
          <div>
            <div className="text-[11.5px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Who?</div>
            <div className="mt-1 flex items-center gap-1.5 text-[14.5px] font-semibold">
              <Users className="size-4 text-[#7C8CF8]" />
              {guestSummary}
            </div>
          </div>
        </button>

        {whoOpen && (
          <div
            className="absolute top-[calc(100%+10px)] left-0 z-20 w-full min-w-[280px] rounded-2xl border border-[#E7E8EC] bg-white p-5"
            style={{ boxShadow: "0 12px 30px rgba(16,24,40,.14)" }}
          >
            <GuestStepper label="Adults" hint="Ages 13 or above" value={adults} min={1} max={10} onChange={setAdults} />
            <div className="my-4 h-px bg-[#F0F1F4]" />
            <GuestStepper label="Children" hint="Ages 2 – 12" value={children} min={0} max={10} onChange={setChildren} />
            <div className="my-4 h-px bg-[#F0F1F4]" />
            <GuestStepper label="Infants" hint="Under 2" value={infants} min={0} max={10} onChange={setInfants} />
            <div className="my-4 h-px bg-[#F0F1F4]" />
            <GuestStepper label="Pets" hint="Bringing a service animal?" value={pets} min={0} max={5} onChange={setPets} />
          </div>
        )}
      </div>

      {hasValidRange ? (
        <>
          <div className="mt-5 flex flex-col gap-3">
            <div className="flex justify-between text-[14.5px] font-medium text-[#6B7280]">
              <span>
                {formatCurrency(pricePerNight)} &times; {nights} night{nights === 1 ? "" : "s"}
              </span>
              <span className="font-semibold text-[#1F2937]">{formatCurrency(pricing.base)}</span>
            </div>
          </div>
          <div className="my-[18px] h-px bg-[#F0F1F4]" />
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold">Total</span>
            <span className="text-2xl font-extrabold tracking-[-.02em]">{formatCurrency(pricing.total)}</span>
          </div>
          <p className="mt-1.5 text-[12.5px] font-medium text-[#9CA3AF]">
            Fees and taxes, if any, are settled with the front desk at check-in.
          </p>
        </>
      ) : (
        <p className="mt-5 text-[13.5px] font-medium text-[#9CA3AF]">
          Select a check-in and check-out date to see your total.
        </p>
      )}

      {hasValidRange ? (
        <Link
          href={bookHref}
          className="btnp mt-5 block w-full rounded-[15px] py-4 text-center text-base font-bold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          Book now
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setDatesOpen(true)}
          className="mt-5 block w-full rounded-[15px] bg-[#F4F5F7] py-4 text-center text-base font-bold text-[#9CA3AF]"
        >
          Select dates
        </button>
      )}
      <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#9CA3AF]">
        <Lock className="size-3.5" />
        You won&apos;t be charged yet
      </div>
    </div>
  );
}
