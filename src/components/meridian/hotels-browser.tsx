"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { listHotels } from "@/lib/data/hotels";
import { formatCurrency } from "@/lib/pricing";

type HotelListing = Awaited<ReturnType<typeof listHotels>>[number];

export function HotelsBrowser({ hotels }: { hotels: HotelListing[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return hotels;
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q)
    );
  }, [hotels, query]);

  return (
    <div>
      <div className="relative max-w-[420px]">
        <Search className="absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#9CA3AF]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by hotel or destination…"
          className="w-full rounded-[13px] border border-[#E7E8EC] bg-white py-3.5 pr-4 pl-[46px] text-[15px] outline-none"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        />
      </div>

      <div className="mt-3 text-[13.5px] font-medium text-[#9CA3AF]">
        {filtered.length} {filtered.length === 1 ? "hotel" : "hotels"} available
      </div>

      <div className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
        {filtered.length === 0 && (
          <div
            className="col-span-full rounded-[20px] border border-[#E7E8EC] bg-white px-6 py-16 text-center"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <p className="text-[15px] font-semibold text-[#374151]">No hotels match your search</p>
            <p className="mt-1.5 text-[13.5px] font-medium text-[#9CA3AF]">
              Try a different hotel name or destination.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: HotelListing }) {
  return (
    <div
      className="lift flex flex-col overflow-hidden rounded-[22px] border border-[#E7E8EC] bg-white"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <HotelCardMedia images={hotel.images} gradient={hotel.gradient} tag={hotel.tag} />
      <div className="flex flex-1 flex-col px-5 py-5 sm:px-6">
        <h3 className="m-0 text-lg font-bold tracking-[-.02em]">{hotel.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-medium text-[#6B7280]">
          <MapPin className="size-[15px] shrink-0 text-[#9CA3AF]" />
          <span className="truncate">{hotel.city}, {hotel.country}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <Star className="size-[15px] fill-[#F6D68A] text-[#F6D68A]" />
          <span className="text-[13.5px] font-bold">{hotel.rating || "New"}</span>
          <span className="text-[13.5px] font-medium text-[#9CA3AF]">
            ({hotel.reviewCount} reviews)
          </span>
        </div>
        <p className="mt-3.5 text-[14px] leading-[1.55] text-[#6B7280]">{hotel.description}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-5">
          <div>
            <span className="text-xl font-extrabold tracking-[-.02em]">{formatCurrency(hotel.priceFrom)}</span>
            <span className="text-[13px] font-medium text-[#9CA3AF]"> / night from</span>
          </div>
          <Link
            href={`/hotels/${hotel.id}`}
            className="btnp rounded-[13px] px-5 py-2.5 text-[13.5px] font-semibold text-white"
            style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}

function HotelCardMedia({
  images,
  gradient,
  tag,
}: {
  images: { url: string }[];
  gradient: string;
  tag: string | null;
}) {
  const [index, setIndex] = useState(0);
  const hasPhotos = images.length > 0;

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
    setIndex((i) => (i + 1) % images.length);
  }

  return (
    <div className="group relative h-[190px] overflow-hidden" style={!hasPhotos ? { background: gradient } : undefined}>
      {hasPhotos && (
        <div
          className="flex h-full transition-transform duration-500 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((img) => (
            <div
              key={img.url}
              className="h-full w-full shrink-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${img.url})` }}
            />
          ))}
        </div>
      )}

      {tag && (
        <div
          className="absolute top-3.5 left-3.5 rounded-full bg-white/94 px-3 py-1.5 text-xs font-bold text-[#1F2937]"
          style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
        >
          {tag}
        </div>
      )}

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute top-1/2 left-2.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 opacity-0 transition-opacity group-hover:opacity-100 hover:!opacity-100"
            style={{ boxShadow: "0 2px 8px rgba(16,24,40,.14)" }}
          >
            <ChevronLeft className="size-4 text-[#1F2937]" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute top-1/2 right-2.5 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 opacity-0 transition-opacity group-hover:opacity-100 hover:!opacity-100"
            style={{ boxShadow: "0 2px 8px rgba(16,24,40,.14)" }}
          >
            <ChevronRight className="size-4 text-[#1F2937]" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((img, i) => (
              <button
                type="button"
                key={img.url}
                onClick={(e) => {
                  e.preventDefault();
                  setIndex(i);
                }}
                aria-label={`Go to photo ${i + 1}`}
                className="h-[6px] cursor-pointer rounded-full transition-all duration-300"
                style={{ width: i === index ? 16 : 6, background: i === index ? "#fff" : "rgba(255,255,255,.5)" }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
