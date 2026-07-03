"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Baby, BedDouble, Search } from "lucide-react";
import { DateRangePicker } from "./date-range-picker";

export function SearchCard() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("2026-06-12");
  const [checkOut, setCheckOut] = useState("2026-06-15");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState(1);

  function handleSearch() {
    const params = new URLSearchParams({
      checkin: checkIn,
      checkout: checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(roomsCount),
    });
    router.push(`/rooms?${params.toString()}`);
  }

  return (
    <div className="relative z-10 -mt-[52px] px-2">
      <div
        className="grid grid-cols-2 gap-1.5 rounded-[22px] border border-[#E7E8EC] bg-white p-3 md:grid-cols-6"
        style={{ boxShadow: "0 16px 40px rgba(16,24,40,.1)" }}
      >
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={(nextCheckIn, nextCheckOut) => {
            setCheckIn(nextCheckIn);
            setCheckOut(nextCheckOut);
          }}
        />

        <div
          className="rounded-[15px] px-[18px] py-3.5"
          style={{ borderLeft: "1px solid #EEEFF2" }}
        >
          <label className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
            Adults
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <User className="size-[17px] shrink-0 text-[#7C8CF8]" />
            <input
              type="number"
              min={1}
              max={10}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
              className="w-full border-0 bg-transparent p-0 text-[15px] font-semibold text-[#1F2937] outline-none"
            />
          </div>
        </div>

        <div
          className="rounded-[15px] px-[18px] py-3.5"
          style={{ borderLeft: "1px solid #EEEFF2" }}
        >
          <label className="text-xs font-semibold tracking-[.04em] text-[#9CA3AF] uppercase">
            Children
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <Baby className="size-[17px] shrink-0 text-[#7C8CF8]" />
            <input
              type="number"
              min={0}
              max={10}
              value={children}
              onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border-0 bg-transparent p-0 text-[15px] font-semibold text-[#1F2937] outline-none"
            />
          </div>
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
