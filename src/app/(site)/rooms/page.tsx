import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RoomsBrowser } from "@/components/meridian/rooms-browser";
import { rooms } from "@/lib/meridian-data";

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    adults?: string;
    children?: string;
    rooms?: string;
  }>;
}) {
  const params = await searchParams;
  const checkIn = formatDate(params.checkin);
  const checkOut = formatDate(params.checkout);
  const adults = Math.max(1, Number(params.adults) || 2);
  const children = Math.max(0, Number(params.children) || 0);
  const roomsCount = Math.max(1, Number(params.rooms) || 1);
  const guests = adults + children;

  const nights =
    params.checkin && params.checkout
      ? Math.max(
          1,
          Math.round(
            (new Date(params.checkout).getTime() - new Date(params.checkin).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 3;

  const available = rooms.filter((r) => r.cap * roomsCount >= guests);

  return (
    <div className="fu mx-auto max-w-[1240px] px-8 pt-10 pb-20">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
        <Link href="/" className="navlink">Home</Link>
        <ChevronRight className="size-[15px]" />
        <span className="text-[#6B7280]">Rooms</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-4xl font-extrabold tracking-[-.03em]">Available rooms</h1>
          <p className="mt-2.5 text-[15.5px] font-medium text-[#6B7280]">
            {checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Jun 12 – 15"} &middot;{" "}
            {nights} nights &middot; {guests} guests
            {roomsCount > 1 ? ` · ${roomsCount} rooms` : ""} &middot;{" "}
            <span className="font-semibold text-[#7C8CF8]">
              {available.length} rooms available
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <RoomsBrowser rooms={available} />
      </div>
    </div>
  );
}
