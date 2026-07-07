import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Star } from "lucide-react";
import { RoomsBrowser } from "@/components/meridian/rooms-browser";
import { getHotelWithRoomTypes } from "@/lib/data/hotels";
import { formatBeds } from "@/lib/meridian-data";
import { coverStyle } from "@/lib/media";
import { LocationMap } from "@/components/meridian/location-map";
import type { PublicRoomListing } from "@/lib/data/room-types";

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const hotel = await getHotelWithRoomTypes(id);
  if (!hotel) notFound();

  const hotelRooms: PublicRoomListing[] = hotel.roomTypes.map((rt) => ({
    id: rt.id,
    hotelId: hotel.id,
    hotel: { id: hotel.id, name: hotel.name, city: hotel.city, country: hotel.country },
    name: rt.name,
    type: rt.category,
    description: rt.description,
    price: Number(rt.basePricePerNight),
    cap: rt.capacity,
    size: rt.sizeSqm,
    bath: rt.bathrooms,
    gradient: rt.gradient,
    coverImageUrl: rt.images[0]?.url ?? null,
    beds: formatBeds(rt.beds),
    rating: hotel.rating,
    reviews: hotel.reviewCount,
  }));

  return (
    <div className="fu mx-auto max-w-[1240px] px-8 pt-10 pb-20">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
        <Link href="/" className="navlink">Home</Link>
        <ChevronRight className="size-[15px]" />
        <Link href="/hotels" className="navlink">Hotels</Link>
        <ChevronRight className="size-[15px]" />
        <span className="text-[#6B7280]">{hotel.name}</span>
      </div>

      <div
        className="relative mt-5 h-[280px] rounded-[22px] bg-cover bg-center"
        style={{ ...coverStyle(hotel.images[0]?.url, hotel.gradient), boxShadow: "0 10px 30px rgba(16,24,40,.08)" }}
      >
        {hotel.tag && (
          <div
            className="absolute top-4 left-4 rounded-full bg-white/94 px-3.5 py-2 text-[13px] font-bold text-[#1F2937]"
            style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
          >
            {hotel.tag}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="m-0 text-4xl font-extrabold tracking-[-.03em]">{hotel.name}</h1>
          <div className="mt-2.5 flex items-center gap-1.5 text-[15px] font-medium text-[#6B7280]">
            <MapPin className="size-4 text-[#9CA3AF]" />
            {hotel.city}, {hotel.country}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="size-4 fill-[#F6D68A] text-[#F6D68A]" />
            <span className="text-sm font-bold">{hotel.rating || "New"}</span>
            <span className="text-sm font-medium text-[#9CA3AF]">
              &middot; {hotel.reviewCount} reviews
            </span>
          </div>
          <p className="mt-3.5 max-w-[640px] text-[15px] leading-[1.6] text-[#6B7280]">
            {hotel.description}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold tracking-[-.02em]">Location</h2>
        <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">{hotel.address}, {hotel.city}, {hotel.country}</p>
        {hotel.latitude != null && hotel.longitude != null ? (
          <div
            className="mt-4 h-[340px] overflow-hidden rounded-[20px] border border-[#E7E8EC]"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <LocationMap lat={hotel.latitude} lng={hotel.longitude} label={`Map showing the location of ${hotel.name}`} />
          </div>
        ) : (
          <div className="mt-4 rounded-[20px] border border-[#E7E8EC] bg-[#FBFBFC] px-6 py-10 text-center text-[13.5px] font-medium text-[#9CA3AF]">
            Map location coming soon.
          </div>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold tracking-[-.02em]">
          Rooms at {hotel.name}
          <span className="ml-2.5 text-base font-semibold text-[#9CA3AF]">
            ({hotelRooms.length})
          </span>
        </h2>
        <div className="mt-6">
          {hotelRooms.length > 0 ? (
            <RoomsBrowser rooms={hotelRooms} />
          ) : (
            <div
              className="rounded-[20px] border border-[#E7E8EC] bg-white px-6 py-16 text-center"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <p className="text-[15px] font-semibold text-[#374151]">No rooms listed yet</p>
              <p className="mt-1.5 text-[13.5px] font-medium text-[#9CA3AF]">
                Check back soon or browse our other hotels.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
