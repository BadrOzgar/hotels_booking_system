"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Power, RotateCcw } from "lucide-react";
import { CrudDrawer } from "@/components/admin/crud-drawer";
import { HotelForm } from "@/components/admin/hotel-form";
import {
  setHotelAccountStatusAction,
  resetHotelAccountAction,
  updateHotelAction,
} from "@/app/super-admin/hotels/actions";

type HotelEditValues = {
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
  coverImageUrl?: string | null;
};

export function SuperAdminHotelActions({
  hotelId,
  accountStatus,
  hotel,
  amenities,
}: {
  hotelId: string;
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED";
  hotel: HotelEditValues;
  amenities: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggleSuspend() {
    const nextStatus = accountStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    startTransition(async () => {
      await setHotelAccountStatusAction(hotelId, nextStatus);
      router.refresh();
    });
  }

  function handleReset() {
    if (!window.confirm("This permanently clears all bookings and guests for this hotel. Continue?")) return;
    startTransition(async () => {
      await resetHotelAccountAction(hotelId);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        className="btns flex items-center gap-2 rounded-[11px] border border-[#E7E8EC] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1F2937]"
      >
        <Pencil className="size-3.5" />
        Edit
      </button>
      <button
        type="button"
        onClick={toggleSuspend}
        disabled={pending}
        className="btns flex items-center gap-2 rounded-[11px] border px-4 py-2.5 text-[13.5px] font-semibold disabled:opacity-60"
        style={
          accountStatus === "SUSPENDED"
            ? { borderColor: "#C9EED8", background: "#EDFBF3", color: "#4FB878" }
            : { borderColor: "#F5CFCF", background: "#FDEEEE", color: "#D96A6A" }
        }
      >
        <Power className="size-3.5" />
        {accountStatus === "SUSPENDED" ? "Activate" : "Suspend"}
      </button>
      <button
        type="button"
        onClick={handleReset}
        disabled={pending}
        className="btns flex items-center gap-2 rounded-[11px] border border-[#E7E8EC] bg-white px-4 py-2.5 text-[13.5px] font-semibold text-[#1F2937] disabled:opacity-60"
      >
        <RotateCcw className="size-3.5" />
        Reset account
      </button>

      <CrudDrawer open={editOpen} onOpenChange={setEditOpen} title="Edit hotel" widthClassName="sm:max-w-xl">
        <HotelForm
          action={updateHotelAction.bind(null, hotelId)}
          amenities={amenities}
          submitLabel="Save changes"
          onSuccess={() => {
            setEditOpen(false);
            router.refresh();
          }}
          onCancel={() => setEditOpen(false)}
          initial={hotel}
        />
      </CrudDrawer>
    </div>
  );
}
