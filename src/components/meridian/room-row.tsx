import Link from "next/link";
import { Star, Users, Maximize, BedDouble } from "lucide-react";
import type { Room } from "@/lib/meridian-data";

export function RoomRow({ room }: { room: Room }) {
  return (
    <div
      className="lift grid grid-cols-1 overflow-hidden rounded-[22px] border border-[#E7E8EC] bg-white sm:grid-cols-[300px_1fr]"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="relative min-h-[236px]" style={{ background: room.gradient }}>
        {room.tag && (
          <div
            className="absolute top-3.5 left-3.5 rounded-full bg-white/94 px-3 py-1.5 text-xs font-bold text-[#1F2937]"
            style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
          >
            {room.tag}
          </div>
        )}
      </div>
      <div className="flex flex-col px-[26px] py-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="m-0 text-[22px] font-bold tracking-[-.02em]">{room.name}</h3>
              <span className="rounded-lg bg-[#F3F5FF] px-[9px] py-1 text-xs font-semibold text-[#7C8CF8]">
                {room.type}
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
        <div className="mt-4 flex gap-[18px] text-[13.5px] font-medium text-[#6B7280]">
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
        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <span className="text-[26px] font-extrabold tracking-[-.02em]">${room.price}</span>
            <span className="text-sm font-medium text-[#9CA3AF]"> / night</span>
          </div>
          <div className="flex gap-2.5">
            <Link
              href={`/rooms/${room.id}`}
              className="btns rounded-[13px] border border-[#E7E8EC] bg-white px-5 py-3 text-[14.5px] font-semibold text-[#1F2937]"
            >
              Details
            </Link>
            <Link
              href={`/booking/${room.id}`}
              className="btnp rounded-[13px] px-[22px] py-3 text-[14.5px] font-semibold text-white"
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
