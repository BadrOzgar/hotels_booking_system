"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { CrudDrawer } from "@/components/admin/crud-drawer";
import { useDrawerForm } from "@/hooks/use-drawer-form";
import { updateBookingDetailsAction } from "@/app/admin/bookings/actions";

type BookingEditValues = {
  id: string;
  confirmationCode: string;
  checkIn: string; // yyyy-mm-dd
  checkOut: string;
  adults: number;
  children: number;
  specialRequests: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
};

export function EditBookingButton({ booking }: { booking: BookingEditValues }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 rounded-[10px] px-3 py-[7px] text-[12.5px] font-semibold text-[#374151] hover:bg-[#F4F5F7]"
      >
        <Pencil className="size-[13px]" />
        Edit
      </button>
      <CrudDrawer open={open} onOpenChange={setOpen} title="Edit booking" description={`Reference ${booking.confirmationCode}`}>
        <EditBookingForm booking={booking} onClose={() => setOpen(false)} />
      </CrudDrawer>
    </>
  );
}

function EditBookingForm({ booking, onClose }: { booking: BookingEditValues; onClose: () => void }) {
  const router = useRouter();
  const action = updateBookingDetailsAction.bind(null, booking.id);
  const { error, pending, submit } = useDrawerForm(action, () => {
    onClose();
    router.refresh();
  });

  return (
    <form action={submit}>
      <div className="grid grid-cols-2 gap-[14px]">
        <Field label="Check in" name="checkIn" type="date" defaultValue={booking.checkIn} />
        <Field label="Check out" name="checkOut" type="date" defaultValue={booking.checkOut} />
      </div>
      <div className="mt-[14px] grid grid-cols-2 gap-[14px]">
        <Field label="Adults" name="adults" type="number" min={1} defaultValue={String(booking.adults)} />
        <Field label="Children" name="children" type="number" min={0} defaultValue={String(booking.children)} />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Guest</h2>
      <div className="mt-3 grid grid-cols-2 gap-[14px]">
        <Field label="First name" name="contactFirstName" defaultValue={booking.contactFirstName} />
        <Field label="Last name" name="contactLastName" defaultValue={booking.contactLastName} />
      </div>
      <div className="mt-[14px] grid grid-cols-2 gap-[14px]">
        <Field label="Email" name="contactEmail" type="email" defaultValue={booking.contactEmail} />
        <Field label="Phone" name="contactPhone" required={false} defaultValue={booking.contactPhone} />
      </div>
      <div className="mt-[14px]">
        <label className="text-[13px] font-semibold text-[#374151]">
          Special requests <span className="font-medium text-[#9CA3AF]">(optional)</span>
        </label>
        <textarea
          name="specialRequests"
          defaultValue={booking.specialRequests}
          className="mt-2 min-h-[70px] w-full resize-none rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3 text-[15px] outline-none"
        />
      </div>

      {error && <p className="mt-4 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

      <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="btns rounded-[13px] border border-[#E7E8EC] bg-white px-[22px] py-3.5 text-center text-[15px] font-semibold text-[#1F2937]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="btnp flex items-center justify-center gap-2 rounded-[13px] px-[26px] py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required = true,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
      />
    </div>
  );
}
