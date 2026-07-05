import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { RoomsBrowser } from "@/components/meridian/rooms-browser";
import { getAvailableRoomTypes } from "@/lib/data/room-types";
import { nightsBetween } from "@/lib/pricing";
import { today } from "@/lib/data/dashboard";

function formatDate(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function defaultIso(daysFromToday: number) {
  const d = today();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
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
    destination?: string;
  }>;
}) {
  const params = await searchParams;
  const checkinValue = params.checkin || defaultIso(0);
  const checkoutValue = params.checkout || defaultIso(3);
  const checkIn = formatDate(checkinValue);
  const checkOut = formatDate(checkoutValue);
  const adults = Math.max(1, Number(params.adults) || 2);
  const children = Math.max(0, Number(params.children) || 0);
  const roomsCount = Math.max(1, Number(params.rooms) || 1);
  const guests = adults + children;
  const destination = params.destination?.trim() || "";

  const checkInDate = new Date(`${checkinValue}T15:00:00`);
  const checkOutDate = new Date(`${checkoutValue}T11:00:00`);
  const nights = nightsBetween(checkInDate, checkOutDate);

  const available = await getAvailableRoomTypes({
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    roomsCount,
    destination: destination || undefined,
  });

  const forwardParams = new URLSearchParams({
    checkin: checkinValue,
    checkout: checkoutValue,
    adults: String(adults),
    children: String(children),
    rooms: String(roomsCount),
  });
  if (destination) forwardParams.set("destination", destination);
  const searchParamsString = `?${forwardParams.toString()}`;

  return (
    <div className="fu mx-auto max-w-[1240px] px-8 pt-10 pb-20">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
        <Link href="/" className="navlink">Home</Link>
        <ChevronRight className="size-[15px]" />
        <span className="text-[#6B7280]">Rooms</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-4xl font-extrabold tracking-[-.03em]">
            {destination ? `Rooms in ${destination}` : "Available rooms"}
          </h1>
          <p className="mt-2.5 text-[15.5px] font-medium text-[#6B7280]">
            {checkIn} &ndash; {checkOut} &middot; {nights} nights &middot; {guests} guests
            {roomsCount > 1 ? ` · ${roomsCount} rooms` : ""} &middot;{" "}
            <span className="font-semibold text-[#7C8CF8]">
              {available.length} rooms available
            </span>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <RoomsBrowser rooms={available} searchParams={searchParamsString} />
      </div>
    </div>
  );
}
