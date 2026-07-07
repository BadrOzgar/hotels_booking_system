import Link from "next/link";
import { ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { RoomsBrowser } from "@/components/meridian/rooms-browser";
import { getAvailableRoomTypes, listAllRoomTypes } from "@/lib/data/room-types";
import { nightsBetween } from "@/lib/pricing";

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
    destination?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const destination = params.destination?.trim() || "";
  // Dates are only applied when the visitor actually searched with them (e.g. via the homepage
  // search card). Landing on /rooms directly — the "Rooms" nav link, no query string — browses
  // the full catalogue instead of silently defaulting to a date window that might show nothing.
  const hasDateSearch = Boolean(params.checkin && params.checkout);

  if (hasDateSearch) {
    const checkinValue = params.checkin!;
    const checkoutValue = params.checkout!;
    const checkIn = formatDate(checkinValue);
    const checkOut = formatDate(checkoutValue);
    const adults = Math.max(1, Number(params.adults) || 2);
    const children = Math.max(0, Number(params.children) || 0);
    const roomsCount = Math.max(1, Number(params.rooms) || 1);
    const guests = adults + children;

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
        <Breadcrumb />
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

  const page = Math.max(1, Number(params.page) || 1);
  const { rooms, totalCount, totalPages } = await listAllRoomTypes({
    destination: destination || undefined,
    page,
    pageSize: 15,
  });

  const pageLinkParams = new URLSearchParams();
  if (destination) pageLinkParams.set("destination", destination);
  const pageLinkBase = pageLinkParams.toString() ? `?${pageLinkParams.toString()}&` : "?";

  return (
    <div className="fu mx-auto max-w-[1240px] px-8 pt-10 pb-20">
      <Breadcrumb />
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-4xl font-extrabold tracking-[-.03em]">
            {destination ? `Rooms in ${destination}` : "Available rooms"}
          </h1>
          <p className="mt-2.5 text-[15.5px] font-medium text-[#6B7280]">
            Pick your dates on any room to check live availability &middot;{" "}
            <span className="font-semibold text-[#7C8CF8]">{totalCount} rooms total</span>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <RoomsBrowser rooms={rooms} searchParams="" />
      </div>

      {totalPages > 1 && (
        <div className="mt-9 flex items-center justify-center gap-1.5">
          <Link
            href={`${pageLinkBase}page=${Math.max(1, page - 1)}`}
            aria-disabled={page === 1}
            className="flex size-9 items-center justify-center rounded-lg border border-[#E7E8EC] bg-white disabled:opacity-40"
            style={page === 1 ? { pointerEvents: "none", opacity: 0.4 } : undefined}
          >
            <ChevronLeft className="size-[15px] text-[#6B7280]" />
          </Link>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, i, arr) => (
              <span key={p} className="flex items-center gap-1.5">
                {i > 0 && arr[i - 1] !== p - 1 && <span className="px-1 text-[#9CA3AF]">…</span>}
                <Link
                  href={`${pageLinkBase}page=${p}`}
                  className="flex size-9 items-center justify-center rounded-lg text-[13px] font-bold"
                  style={
                    p === page
                      ? { background: "#7C8CF8", color: "#fff" }
                      : { border: "1px solid #E7E8EC", color: "#6B7280" }
                  }
                >
                  {p}
                </Link>
              </span>
            ))}
          <Link
            href={`${pageLinkBase}page=${Math.min(totalPages, page + 1)}`}
            className="flex size-9 items-center justify-center rounded-lg border border-[#E7E8EC] bg-white"
            style={page === totalPages ? { pointerEvents: "none", opacity: 0.4 } : undefined}
          >
            <ChevronRightIcon className="size-[15px] text-[#6B7280]" />
          </Link>
        </div>
      )}
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
      <Link href="/" className="navlink">Home</Link>
      <ChevronRight className="size-[15px]" />
      <span className="text-[#6B7280]">Rooms</span>
    </div>
  );
}
