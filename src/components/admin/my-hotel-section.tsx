"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, MapPin } from "lucide-react";
import { CrudDrawer } from "@/components/admin/crud-drawer";
import { HotelForm } from "@/components/admin/hotel-form";
import { updateMyHotelAction } from "@/app/admin/settings/actions";
import { coverStyle } from "@/lib/media";

type HotelSummary = {
  name: string;
  description: string;
  city: string;
  country: string;
  address: string;
  starRating: number;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
  serviceFeeCents: number;
  taxRatePercent: number;
  tag: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  freeCancellationHours: number;
  penaltyNights: number;
  amenityIds: string[];
  gradient: string;
  coverImageUrl: string | null;
};

export function MyHotelSection({
  hotel,
  amenities,
}: {
  hotel: HotelSummary;
  amenities: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="rounded-[20px] border border-[#E7E8EC] bg-white p-7"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-base font-bold">My hotel</h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btns flex items-center gap-2 rounded-[11px] border border-[#E7E8EC] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1F2937]"
        >
          <Pencil className="size-3.5" />
          Edit
        </button>
      </div>
      <div className="mt-[18px] flex gap-4">
        <div
          className="size-16 shrink-0 rounded-2xl bg-cover bg-center"
          style={coverStyle(hotel.coverImageUrl, hotel.gradient)}
        />
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[17px] font-bold">{hotel.name}</div>
            {hotel.tag && (
              <span className="rounded-full bg-[#F3F5FF] px-2.5 py-0.5 text-[11.5px] font-bold text-[#7C8CF8]">
                {hotel.tag}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[13.5px] font-medium text-[#6B7280]">
            <MapPin className="size-[14px] text-[#9CA3AF]" />
            {hotel.address}, {hotel.city}, {hotel.country}
          </div>
          <p className="mt-2 max-w-[520px] text-[13.5px] leading-[1.55] text-[#6B7280]">{hotel.description}</p>
        </div>
      </div>

      <CrudDrawer open={open} onOpenChange={setOpen} title="Edit my hotel" widthClassName="sm:max-w-xl">
        <HotelForm
          action={updateMyHotelAction}
          amenities={amenities}
          submitLabel="Save changes"
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
          onCancel={() => setOpen(false)}
          initial={{
            name: hotel.name,
            description: hotel.description,
            city: hotel.city,
            country: hotel.country,
            address: hotel.address,
            starRating: hotel.starRating,
            currency: hotel.currency,
            checkInTime: hotel.checkInTime,
            checkOutTime: hotel.checkOutTime,
            serviceFeeCents: hotel.serviceFeeCents,
            taxRatePercent: hotel.taxRatePercent,
            tag: hotel.tag,
            contactEmail: hotel.contactEmail,
            contactPhone: hotel.contactPhone,
            freeCancellationHours: hotel.freeCancellationHours,
            penaltyNights: hotel.penaltyNights,
            amenityIds: hotel.amenityIds,
            coverImageUrl: hotel.coverImageUrl,
          }}
        />
      </CrudDrawer>
    </div>
  );
}
