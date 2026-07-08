import Link from "next/link";
import { Star, Users, Maximize, BedDouble, MapPin } from "lucide-react";
import type { PublicRoomListing } from "@/lib/data/room-types";
import { formatCurrency } from "@/lib/pricing";
import { coverStyle } from "@/lib/media";

export function RoomRow({ room, searchParams = "" }: { room: PublicRoomListing; searchParams?: string }) {
  return (
    <div
      className="lift grid grid-cols-1 overflow-hidden rounded-[22px] border border-[#E7E8EC] bg-white sm:grid-cols-[300px_1fr]"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="relative min-h-[236px] bg-cover bg-center" style={coverStyle(room.coverImageUrl, room.gradient)}>
        {room.tag && (
          <div
            className="absolute top-3.5 left-3.5 rounded-full bg-white/94 px-3 py-1.5 text-xs font-bold text-[#1F2937]"
            style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
          >
            {room.tag}
          </div>
        )}
      </div>
      <div className="flex flex-col px-5 py-5 sm:px-[26px] sm:py-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="m-0 text-[20px] font-bold tracking-[-.02em] sm:text-[22px]">{room.name}</h3>
              <span className="rounded-lg bg-[#F3F5FF] px-[9px] py-1 text-xs font-semibold text-[#7C8CF8]">
                {room.type}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-medium text-[#6B7280]">
              <MapPin className="size-[14px] shrink-0 text-[#9CA3AF]" />
              <span className="truncate">
                {room.hotel.name} &middot; {room.hotel.city}, {room.hotel.country}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="size-[15px] fill-[#F6D68A] text-[#F6D68A]" />
              <span className="text-[13.5px] font-bold">{room.rating}</span>
              <span className="text-[13.5px] font-medium text-[#9CA3AF]">
                ({room.reviews} reviews)
              </span>
            </div>
          </div>
        </div>
        <p className="mt-3.5 text-[14.5px] leading-[1.55] text-[#6B7280]">{room.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-[18px] gap-y-1.5 text-[13.5px] font-medium text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <Users className="size-4 text-[#9CA3AF]" />
            {room.cap} guests
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="size-4 text-[#9CA3AF]" />
            {room.size} m&sup2;
          </span>
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-[#9CA3AF]" />
            {room.beds}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div>
            <span className="text-[26px] font-extrabold tracking-[-.02em]">{formatCurrency(room.price)}</span>
            <span className="text-sm font-medium text-[#9CA3AF]"> / night</span>
          </div>
          <div className="flex w-full gap-2.5 sm:w-auto">
            <Link
              href={`/rooms/${room.id}${searchParams}`}
              className="btns flex-1 rounded-[13px] border border-[#E7E8EC] bg-white px-5 py-3 text-center text-[14.5px] font-semibold text-[#1F2937] sm:flex-none"
            >
              Details
            </Link>
            <Link
              href={`/booking/${room.id}${searchParams}`}
              className="btnp flex-1 rounded-[13px] px-[22px] py-3 text-center text-[14.5px] font-semibold text-white sm:flex-none"
              style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
