"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, BedDouble, Search, MapPin, Minus, Plus } from "lucide-react";
import { DateRangePicker } from "./date-range-picker";

function defaultIso(daysFromToday: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export function SearchCard() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(() => defaultIso(0));
  const [checkOut, setCheckOut] = useState(() => defaultIso(3));
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);
  const [whoOpen, setWhoOpen] = useState(false);
  const whoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (whoRef.current && !whoRef.current.contains(e.target as Node)) setWhoOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams({
      checkin: checkIn,
      checkout: checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(roomsCount),
    });
    if (destination.trim()) params.set("destination", destination.trim());
    if (infants > 0) params.set("infants", String(infants));
    if (pets > 0) params.set("pets", String(pets));
    router.push(`/rooms?${params.toString()}`);
  }

  const guestSummary = [
    `${adults} adult${adults === 1 ? "" : "s"}`,
    children > 0 ? `${children} child${children === 1 ? "" : "ren"}` : null,
    infants > 0 ? `${infants} infant${infants === 1 ? "" : "s"}` : null,
    pets > 0 ? `${pets} pet${pets === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="relative z-10 -mt-[52px] px-2">
      <div
        className="grid grid-cols-2 gap-1.5 rounded-[22px] border border-[#E7E8EC] bg-white p-3 md:grid-cols-6"
        style={{ boxShadow: "0 16px 40px rgba(16,24,40,.1)" }}
      >
        <div className="col-span-2 rounded-[15px] px-[18px] py-3.5 md:col-span-1">
          <label className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
            Destination
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <MapPin className="size-[17px] shrink-0 text-[#7C8CF8]" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Anywhere"
              className="w-full border-0 bg-transparent p-0 text-[15px] font-semibold text-[#1F2937] outline-none placeholder:text-[#9CA3AF] placeholder:font-medium"
            />
          </div>
        </div>

        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={(nextCheckIn, nextCheckOut) => {
            setCheckIn(nextCheckIn);
            setCheckOut(nextCheckOut);
          }}
        />

        <div ref={whoRef} className="relative rounded-[15px] px-[18px] py-3.5" style={{ borderLeft: "1px solid #EEEFF2" }}>
          <label className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">Who?</label>
          <button
            type="button"
            onClick={() => setWhoOpen((v) => !v)}
            className="mt-1.5 flex w-full cursor-pointer items-center gap-2 text-left"
          >
            <Users className="size-[17px] shrink-0 text-[#7C8CF8]" />
            <span className="truncate text-[15px] font-semibold text-[#1F2937]">{guestSummary}</span>
          </button>

          {whoOpen && (
            <div
              className="absolute top-[calc(100%+10px)] left-0 z-20 w-[280px] rounded-2xl border border-[#E7E8EC] bg-white p-5"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.14)" }}
            >
              <GuestStepper
                label="Adults"
                hint="Ages 13 or above"
                value={adults}
                min={1}
                max={10}
                onChange={setAdults}
              />
              <div className="my-4 h-px bg-[#F0F1F4]" />
              <GuestStepper
                label="Children"
                hint="Ages 2 – 12"
                value={children}
                min={0}
                max={10}
                onChange={setChildren}
              />
              <div className="my-4 h-px bg-[#F0F1F4]" />
              <GuestStepper
                label="Infants"
                hint="Under 2"
                value={infants}
                min={0}
                max={10}
                onChange={setInfants}
              />
              <div className="my-4 h-px bg-[#F0F1F4]" />
              <GuestStepper
                label="Pets"
                hint="Bringing a service animal?"
                value={pets}
                min={0}
                max={5}
                onChange={setPets}
              />
            </div>
          )}
        </div>

        <div
          className="rounded-[15px] px-[18px] py-3.5"
          style={{ borderLeft: "1px solid #EEEFF2" }}
        >
          <label className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
            Rooms
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <BedDouble className="size-[17px] shrink-0 text-[#7C8CF8]" />
            <input
              type="number"
              min={1}
              max={10}
              value={roomsCount}
              onChange={(e) => setRoomsCount(Math.max(1, Number(e.target.value) || 1))}
              className="w-full border-0 bg-transparent p-0 text-[15px] font-semibold text-[#1F2937] outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="btnp flex items-center justify-center gap-[9px] rounded-[15px] px-6 py-3.5 text-[15px] font-semibold text-white md:py-0"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          <Search className="size-[18px]" />
          Search
        </button>
      </div>
    </div>
  );
}

function GuestStepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-[15px] font-bold text-[#1F2937]">{label}</div>
        <div className="text-[13px] font-medium text-[#9CA3AF]">{hint}</div>
      </div>
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label.toLowerCase()}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#D8DAE2] text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-4 text-center text-[15px] font-semibold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label.toLowerCase()}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-[#D8DAE2] text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
