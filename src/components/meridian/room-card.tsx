import Link from "next/link";
import { Star, Users, Maximize, Bed, ArrowRight } from "lucide-react";
import type { Room } from "@/lib/meridian-data";

export function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      href={`/rooms/${room.id}`}
      className="lift block overflow-hidden rounded-[22px] border border-[#E7E8EC] bg-white"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="relative h-[220px]" style={{ background: room.gradient }}>
        {room.tag && (
          <div
            className="absolute top-3.5 left-3.5 rounded-full bg-white/94 px-3 py-1.5 text-xs font-bold text-[#1F2937]"
            style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
          >
            {room.tag}
          </div>
        )}
        <div
          className="absolute top-3.5 right-3.5 flex items-center gap-[5px] rounded-full bg-white/94 px-[11px] py-1.5 text-[12.5px] font-bold text-[#1F2937]"
          style={{ boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
        >
          <Star className="size-[13px] fill-[#F6D68A] text-[#F6D68A]" />
          {room.rating}
        </div>
      </div>
      <div className="px-[22px] pt-[22px] pb-6">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-xl font-bold tracking-[-.02em]">{room.name}</h3>
          <span className="text-[13px] font-semibold text-[#9CA3AF]">{room.type}</span>
        </div>
        <div className="mt-3.5 flex gap-4 text-[13.5px] font-medium text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            <Users className="size-[15px] text-[#9CA3AF]" />
            {room.cap} guests
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="size-[15px] text-[#9CA3AF]" />
            {room.size} m&sup2;
          </span>
          <span className="flex items-center gap-1.5">
            <Bed className="size-[15px] text-[#9CA3AF]" />
            {room.bath} bath
          </span>
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-[#F0F1F4] pt-[18px]">
          <div>
            <span className="text-2xl font-extrabold tracking-[-.02em]">${room.price}</span>
            <span className="text-sm font-medium text-[#9CA3AF]"> / night</span>
          </div>
          <span className="flex items-center gap-[5px] text-sm font-semibold text-[#7C8CF8]">
            Details <ArrowRight className="size-[15px]" />
          </span>
        </div>
      </div>
    </Link>
  );
}
