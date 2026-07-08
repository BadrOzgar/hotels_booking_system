"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Star, SlidersHorizontal, X } from "lucide-react";
import type { PublicRoomListing } from "@/lib/data/room-types";
import { formatCurrency } from "@/lib/pricing";
import { RoomRow } from "./room-row";

type Sort = "featured" | "low" | "high";

const PRICE_MIN = 160;
const PRICE_MAX = 1200;
const CAPACITIES = ["1", "2", "3", "4+"] as const;
const BED_TYPES = ["King", "Queen", "Twin"] as const;
const RATINGS = [4.5, 4.0, 3.5] as const;

const on = { background: "#fff", color: "#1F2937", boxShadow: "0 1px 3px rgba(16,24,40,.12)" };
const off = { background: "transparent", color: "#9CA3AF" };

export type Filters = {
  priceMin: number;
  priceMax: number;
  capacity: (typeof CAPACITIES)[number] | null;
  bedTypes: string[];
  minRating: number | null;
};

const defaultFilters: Filters = {
  priceMin: PRICE_MIN,
  priceMax: PRICE_MAX,
  capacity: null,
  bedTypes: [],
  minRating: null,
};

function countActiveFilters(filters: Filters): number {
  let count = 0;
  if (filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX) count++;
  if (filters.capacity !== null) count++;
  if (filters.bedTypes.length > 0) count++;
  if (filters.minRating !== null) count++;
  return count;
}

export function RoomsBrowser({ rooms, searchParams = "" }: { rooms: PublicRoomListing[]; searchParams?: string }) {
  const [sort, setSort] = useState<Sort>("featured");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const activeFilterCount = countActiveFilters(filters);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      if (room.price < filters.priceMin || room.price > filters.priceMax) return false;

      if (filters.capacity) {
        if (filters.capacity === "4+" ? room.cap < 4 : room.cap !== Number(filters.capacity)) {
          return false;
        }
      }

      if (filters.bedTypes.length > 0) {
        const matches = filters.bedTypes.some((type) =>
          room.beds.toLowerCase().includes(type.toLowerCase())
        );
        if (!matches) return false;
      }

      if (filters.minRating !== null && room.rating < filters.minRating) return false;

      return true;
    });
  }, [rooms, filters]);

  const sorted = useMemo(() => {
    const list = filtered.slice();
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filtered, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="hidden text-[13.5px] font-medium text-[#9CA3AF] sm:inline">Sort</span>
          <div className="flex gap-1 rounded-xl border border-[#E7E8EC] bg-[#F4F5F7] p-1">
            <button
              type="button"
              onClick={() => setSort("featured")}
              style={sort === "featured" ? on : off}
              className="rounded-lg px-2.5 py-[7px] text-[13px] font-semibold whitespace-nowrap sm:px-[13px]"
            >
              Featured
            </button>
            <button
              type="button"
              onClick={() => setSort("low")}
              style={sort === "low" ? on : off}
              className="rounded-lg px-2.5 py-[7px] text-[13px] font-semibold whitespace-nowrap sm:px-[13px]"
            >
              Price &uarr;
            </button>
            <button
              type="button"
              onClick={() => setSort("high")}
              style={sort === "high" ? on : off}
              className="rounded-lg px-2.5 py-[7px] text-[13px] font-semibold whitespace-nowrap sm:px-[13px]"
            >
              Price &darr;
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#E7E8EC] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1F2937] lg:hidden"
        >
          <SlidersHorizontal className="size-4 text-[#7C8CF8]" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-[#7C8CF8] text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <div
            className="sticky top-[92px] rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <FiltersPanel filters={filters} onChange={setFilters} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {sorted.length > 0 ? (
            sorted.map((room) => <RoomRow key={room.id} room={room} searchParams={searchParams} />)
          ) : (
            <div
              className="rounded-[20px] border border-[#E7E8EC] bg-white px-6 py-16 text-center"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <p className="text-[15px] font-semibold text-[#374151]">No rooms match your filters</p>
              <p className="mt-1.5 text-[13.5px] font-medium text-[#9CA3AF]">
                Try widening the price range or clearing a filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS BOTTOM SHEET */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[24px] bg-white p-6 pb-8">
            <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-[#E7E8EC]" />
            <div className="flex items-center justify-between">
              <span className="text-base font-bold">Filters</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#F4F5F7]"
              >
                <X className="size-4 text-[#6B7280]" />
              </button>
            </div>
            <FiltersPanel filters={filters} onChange={setFilters} />
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="btnp mt-6 w-full rounded-[13px] py-3.5 text-[15px] font-semibold text-white"
              style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
            >
              Show {sorted.length} room{sorted.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FiltersPanel({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  const hasActiveFilters =
    filters.priceMin !== PRICE_MIN ||
    filters.priceMax !== PRICE_MAX ||
    filters.capacity !== null ||
    filters.bedTypes.length > 0 ||
    filters.minRating !== null;

  function setPriceMin(value: number) {
    onChange({ ...filters, priceMin: Math.min(value, filters.priceMax) });
  }

  function setPriceMax(value: number) {
    onChange({ ...filters, priceMax: Math.max(value, filters.priceMin) });
  }

  function toggleCapacity(n: (typeof CAPACITIES)[number]) {
    onChange({ ...filters, capacity: filters.capacity === n ? null : n });
  }

  function toggleBedType(label: string) {
    const bedTypes = filters.bedTypes.includes(label)
      ? filters.bedTypes.filter((t) => t !== label)
      : [...filters.bedTypes, label];
    onChange({ ...filters, bedTypes });
  }

  function toggleRating(value: number) {
    onChange({ ...filters, minRating: filters.minRating === value ? null : value });
  }

  const minPct = ((filters.priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((filters.priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="hidden text-base font-bold lg:inline">Filters</span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => onChange(defaultFilters)}
            className="navlink text-[13px] font-semibold text-[#7C8CF8]"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-[22px]">
        <div className="text-[13px] font-bold text-[#374151]">Price per night</div>
        <div className="relative mt-5 h-[5px] rounded-full bg-[#EDEEF2]">
          <div
            className="absolute h-[5px] rounded-full bg-[#7C8CF8]"
            style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={filters.priceMin}
            onChange={(e) => setPriceMin(Number(e.target.value))}
            className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 h-[5px] w-full -translate-y-1/2 appearance-none bg-transparent"
            style={{ zIndex: filters.priceMin > PRICE_MAX - 50 ? 5 : 3 }}
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={filters.priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="range-thumb pointer-events-none absolute inset-x-0 top-1/2 h-[5px] w-full -translate-y-1/2 appearance-none bg-transparent"
            style={{ zIndex: 4 }}
            aria-label="Maximum price"
          />
        </div>
        <div className="mt-3 flex justify-between text-[13px] font-semibold text-[#6B7280]">
          <span>{formatCurrency(filters.priceMin)}</span>
          <span>{formatCurrency(filters.priceMax)}</span>
        </div>
      </div>

      <div className="my-[22px] h-px bg-[#F0F1F4]" />

      <div>
        <div className="text-[13px] font-bold text-[#374151]">Capacity</div>
        <div className="mt-3.5 flex flex-wrap gap-2">
          {CAPACITIES.map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => toggleCapacity(n)}
              className="cursor-pointer rounded-[10px] border px-3.5 py-2 text-[13px] font-semibold"
              style={
                filters.capacity === n
                  ? { borderColor: "#7C8CF8", background: "#F3F5FF", color: "#7C8CF8" }
                  : { borderColor: "#E7E8EC", color: "#6B7280" }
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="my-[22px] h-px bg-[#F0F1F4]" />

      <div>
        <div className="text-[13px] font-bold text-[#374151]">Bed type</div>
        <div className="mt-3.5 flex flex-col gap-3">
          {BED_TYPES.map((label) => {
            const checked = filters.bedTypes.includes(label);
            return (
              <label
                key={label}
                className="flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#6B7280]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleBedType(label)}
                  className="sr-only"
                />
                <span
                  className="flex size-[18px] items-center justify-center rounded-md"
                  style={
                    checked
                      ? { border: "2px solid #7C8CF8", background: "#7C8CF8" }
                      : { border: "2px solid #D8DAE2" }
                  }
                >
                  {checked && <Check className="size-3 text-white" />}
                </span>
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="my-[22px] h-px bg-[#F0F1F4]" />

      <div>
        <div className="text-[13px] font-bold text-[#374151]">Rating</div>
        <div className="mt-3.5 flex flex-col gap-2">
          {RATINGS.map((value) => {
            const checked = filters.minRating === value;
            return (
              <button
                type="button"
                key={value}
                onClick={() => toggleRating(value)}
                className="flex cursor-pointer items-center gap-2 rounded-[10px] border px-3.5 py-2 text-left text-[13px] font-semibold"
                style={
                  checked
                    ? { borderColor: "#7C8CF8", background: "#F3F5FF", color: "#7C8CF8" }
                    : { borderColor: "#E7E8EC", color: "#6B7280" }
                }
              >
                <Star
                  className="size-3.5"
                  style={
                    checked
                      ? { fill: "#7C8CF8", color: "#7C8CF8" }
                      : { fill: "#F6D68A", color: "#F6D68A" }
                  }
                />
                {value.toFixed(1)}+
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
