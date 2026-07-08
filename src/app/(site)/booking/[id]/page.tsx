import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getRoomType } from "@/lib/data/room-types";
import { computePricing, nightsBetween } from "@/lib/pricing";
import { today } from "@/lib/data/dashboard";
import { BookingForm } from "@/components/meridian/booking-form";

function defaultIso(daysFromToday: number) {
  const d = today();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    adults?: string;
    children?: string;
  }>;
}) {
  const { id } = await params;
  const search = await searchParams;
  const room = await getRoomType(id);
  if (!room) notFound();

  const checkinValue = search.checkin || defaultIso(0);
  const checkoutValue = search.checkout || defaultIso(3);
  const adults = Math.max(1, Number(search.adults) || 2);
  const childCount = Math.max(0, Number(search.children) || 0);

  const nights = nightsBetween(new Date(`${checkinValue}T15:00:00`), new Date(`${checkoutValue}T11:00:00`));
  // Guest checkout is pay-at-hotel only — fees/taxes are settled with the front desk, not charged here.
  const pricing = computePricing({
    pricePerNight: Number(room.basePricePerNight),
    nights,
    serviceFeeCents: 0,
    taxRatePercent: 0,
  });

  return (
    <div className="fu mx-auto max-w-[1080px] px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pb-20">
      <Link
        href={`/rooms/${room.id}`}
        className="navlink inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280]"
      >
        <ArrowLeft className="size-[17px]" />
        Back to room
      </Link>
      <h1 className="mt-5 text-[26px] font-extrabold tracking-[-.03em] sm:text-[30px] md:text-[34px]">
        Confirm your stay
      </h1>

      {/* STEPS */}
      <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-[9px]">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#7C8CF8] text-[13px] font-bold text-white">
            1
          </span>
          <span className="text-[13px] font-semibold sm:text-sm">Your details</span>
        </div>
        <div className="h-0.5 w-6 shrink-0 bg-[#E7E8EC] sm:w-10" />
        <div className="flex items-center gap-[9px]">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#F4F5F7] text-[13px] font-bold text-[#9CA3AF]">
            2
          </span>
          <span className="text-[13px] font-semibold text-[#9CA3AF] sm:text-sm">Payment</span>
        </div>
        <div className="h-0.5 w-6 shrink-0 bg-[#E7E8EC] sm:w-10" />
        <div className="flex items-center gap-[9px]">
          <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#F4F5F7] text-[13px] font-bold text-[#9CA3AF]">
            3
          </span>
          <span className="text-[13px] font-semibold text-[#9CA3AF] sm:text-sm">Confirmed</span>
        </div>
      </div>

      <div className="mt-8">
        <BookingForm
          roomTypeId={room.id}
          roomName={room.name}
          roomCategory={room.category}
          gradient={room.gradient}
          coverImageUrl={room.images.find((img) => img.isCover)?.url ?? room.images[0]?.url ?? null}
          rating={room.rating}
          checkIn={checkinValue}
          checkOut={checkoutValue}
          checkInLabel={formatDate(checkinValue)}
          checkOutLabel={formatDate(checkoutValue)}
          adults={adults}
          childCount={childCount}
          nights={nights}
          pricePerNight={Number(room.basePricePerNight)}
          base={pricing.base}
          serviceFee={pricing.serviceFee}
          tax={pricing.tax}
          total={pricing.total}
        />
      </div>
    </div>
  );
}
