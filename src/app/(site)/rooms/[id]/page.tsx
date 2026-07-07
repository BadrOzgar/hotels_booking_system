import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Star,
  Users,
  Maximize,
  BedDouble,
  Bath,
  Check,
  Clock,
  CigaretteOff,
  VolumeX,
  ShieldCheck,
} from "lucide-react";
import { getRoomType, getRoomTypeUnavailableDates } from "@/lib/data/room-types";
import { formatBeds } from "@/lib/meridian-data";
import { RoomGallery } from "@/components/meridian/room-gallery";
import { RoomBookingPanel } from "@/components/meridian/room-booking-panel";
import { LocationMap } from "@/components/meridian/location-map";

export default async function RoomDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    adults?: string;
    children?: string;
    infants?: string;
    pets?: string;
    rooms?: string;
  }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const [room, unavailableDates] = await Promise.all([getRoomType(id), getRoomTypeUnavailableDates(id)]);
  if (!room) notFound();

  const checkinValue = search.checkin ?? "";
  const checkoutValue = search.checkout ?? "";
  const adults = Math.max(1, Number(search.adults) || 2);
  const children = Math.max(0, Number(search.children) || 0);
  const infants = Math.max(0, Number(search.infants) || 0);
  const pets = Math.max(0, Number(search.pets) || 0);
  const roomsCount = Math.max(1, Number(search.rooms) || 1);

  return (
    <div className="fu mx-auto max-w-[1240px] px-8 pt-8 pb-20">
      <div className="flex items-center gap-2 text-[13.5px] font-medium text-[#9CA3AF]">
        <Link href="/" className="navlink">Home</Link>
        <ChevronRight className="size-[15px]" />
        <Link href="/rooms" className="navlink">Rooms</Link>
        <ChevronRight className="size-[15px]" />
        <span className="text-[#6B7280]">{room.name}</span>
      </div>

      {/* GALLERY */}
      <RoomGallery room={{ gradient: room.gradient, images: room.images.map((img) => ({ url: img.url })) }} />

      <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_380px]">
        {/* LEFT */}
        <div>
          <span className="rounded-lg bg-[#F3F5FF] px-[11px] py-[5px] text-[12.5px] font-bold text-[#7C8CF8]">
            {room.category}
          </span>
          <h1 className="mt-3.5 text-4xl font-extrabold tracking-[-.03em]">{room.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold">
            <Star className="size-4 fill-[#F6D68A] text-[#F6D68A]" />
            {room.rating || "New"}{" "}
            <span className="font-medium text-[#9CA3AF]">&middot; {room.reviewCount} reviews</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Users, label: "Guests", value: room.capacity },
              { icon: Maximize, label: "Size", value: room.sizeSqm ? `${room.sizeSqm} m²` : "—" },
              { icon: BedDouble, label: "Beds", value: formatBeds(room.beds) },
              { icon: Bath, label: "Bathrooms", value: room.bathrooms },
            ].map((s) => (
              <div
                key={s.label}
                className="flex-1 min-w-[110px] rounded-2xl border border-[#E7E8EC] bg-white p-[18px] text-center"
              >
                <s.icon className="mx-auto size-[22px] text-[#7C8CF8]" />
                <div className="mt-2 text-[13px] font-semibold text-[#9CA3AF]">{s.label}</div>
                <div className="mt-0.5 text-base font-bold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="my-8 h-px bg-[#F0F1F4]" />
          <h2 className="text-[22px] font-bold tracking-[-.02em]">About this room</h2>
          <p className="mt-3.5 text-base leading-[1.7] text-[#4B5563]">{room.description}</p>

          <div className="my-8 h-px bg-[#F0F1F4]" />
          <h2 className="text-[22px] font-bold tracking-[-.02em]">What this room offers</h2>
          <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {room.amenities.map((a) => (
              <div key={a.amenityId} className="flex items-center gap-3 text-[15px] font-medium text-[#374151]">
                <span className="flex size-9 items-center justify-center rounded-[11px] bg-[#F3F5FF]">
                  <Check className="size-[18px] text-[#7C8CF8]" />
                </span>
                {a.amenity.label}
              </div>
            ))}
          </div>

          <div className="my-8 h-px bg-[#F0F1F4]" />
          <h2 className="text-[22px] font-bold tracking-[-.02em]">Location</h2>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            {room.hotel.address}, {room.hotel.city}, {room.hotel.country}
          </p>
          {room.hotel.latitude != null && room.hotel.longitude != null ? (
            <div
              className="mt-4 h-[300px] overflow-hidden rounded-[20px] border border-[#E7E8EC]"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <LocationMap
                lat={room.hotel.latitude}
                lng={room.hotel.longitude}
                label={`Map showing the location of ${room.hotel.name}`}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-[20px] border border-[#E7E8EC] bg-[#FBFBFC] px-6 py-10 text-center text-[13.5px] font-medium text-[#9CA3AF]">
              Map location coming soon.
            </div>
          )}

          <div className="my-8 h-px bg-[#F0F1F4]" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold tracking-[-.02em]">House rules</h2>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex gap-2.5 text-[14.5px] font-medium text-[#6B7280]">
                  <Clock className="size-[18px] shrink-0 text-[#9CA3AF]" />
                  Check-in {room.hotel.checkInTime} &middot; Check-out {room.hotel.checkOutTime}
                </div>
                <div className="flex gap-2.5 text-[14.5px] font-medium text-[#6B7280]">
                  <CigaretteOff className="size-[18px] shrink-0 text-[#9CA3AF]" />
                  No smoking indoors
                </div>
                <div className="flex gap-2.5 text-[14.5px] font-medium text-[#6B7280]">
                  <VolumeX className="size-[18px] shrink-0 text-[#9CA3AF]" />
                  Quiet hours after 10:00 PM
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-[-.02em]">Cancellation</h2>
              <div className="mt-4 rounded-2xl border border-[#C9EED8] bg-[#EDFBF3] p-[18px]">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="size-5 shrink-0 text-[#4FB878]" />
                  <div>
                    <div className="text-[14.5px] font-bold text-[#2F7F52]">Free cancellation</div>
                    <div className="mt-1 text-[13.5px] leading-[1.5] text-[#4B8E68]">
                      Cancel before 48 hours of arrival for a full refund. After that, the
                      first night is charged.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STICKY PRICE SUMMARY */}
        <RoomBookingPanel
          roomId={room.id}
          pricePerNight={Number(room.basePricePerNight)}
          unavailableDates={unavailableDates}
          initialCheckIn={checkinValue}
          initialCheckOut={checkoutValue}
          initialAdults={adults}
          initialChildren={children}
          initialInfants={infants}
          initialPets={pets}
          roomsCount={roomsCount}
        />
      </div>
    </div>
  );
}
