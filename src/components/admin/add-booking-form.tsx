"use client";

import { useState } from "react";
import { useDrawerForm } from "@/hooks/use-drawer-form";
import { createBookingAction } from "@/app/admin/bookings/actions";
import { PaymentMethod } from "@/components/meridian/payment-method";
import { formatCurrency } from "@/lib/pricing";

type RoomOption = { id: string; name: string; basePricePerNight: number; capacity: number };
type InitialGuest = { firstName: string; lastName: string; email: string; phone?: string | null };

export function AddBookingForm({
  roomOptions,
  initialGuest,
  onSuccess,
  onCancel,
}: {
  roomOptions: RoomOption[];
  initialGuest?: InitialGuest;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { error, pending, submit } = useDrawerForm(createBookingAction, onSuccess);
  const [source, setSource] = useState<"PHONE" | "WALK_IN">("PHONE");

  return (
    <form action={submit}>
      <input type="hidden" name="source" value={source} />

      <div>
        <label className="text-[13px] font-semibold text-[#374151]">Booking source</label>
        <div className="mt-2 flex gap-2">
          {(["PHONE", "WALK_IN"] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setSource(s)}
              className="flex-1 cursor-pointer rounded-[11px] border px-3.5 py-2.5 text-[13px] font-semibold"
              style={
                source === s
                  ? { borderColor: "#7C8CF8", background: "#F3F5FF", color: "#4A5AE0" }
                  : { borderColor: "#E7E8EC", color: "#6B7280" }
              }
            >
              {s === "PHONE" ? "Phone" : "Walk-in"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[16px]">
        <label className="text-[13px] font-semibold text-[#374151]">Room</label>
        <select
          name="roomTypeId"
          required
          defaultValue=""
          className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
        >
          <option value="" disabled>
            Select a room…
          </option>
          {roomOptions.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} — {formatCurrency(r.basePricePerNight)}/night · {r.capacity} guests
            </option>
          ))}
        </select>
      </div>

      <div className="mt-[16px] grid grid-cols-2 gap-[14px]">
        <Field label="Check in" name="checkIn" type="date" />
        <Field label="Check out" name="checkOut" type="date" />
      </div>
      <div className="mt-[14px] grid grid-cols-2 gap-[14px]">
        <Field label="Adults" name="adults" type="number" defaultValue="2" min={1} />
        <Field label="Children" name="children" type="number" defaultValue="0" min={0} />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Guest</h2>
      <div className="mt-3 grid grid-cols-2 gap-[14px]">
        <Field label="First name" name="firstName" defaultValue={initialGuest?.firstName} />
        <Field label="Last name" name="lastName" defaultValue={initialGuest?.lastName} />
      </div>
      <div className="mt-[14px] grid grid-cols-2 gap-[14px]">
        <Field label="Email" name="email" type="email" defaultValue={initialGuest?.email} />
        <Field label="Phone" name="phone" required={false} defaultValue={initialGuest?.phone ?? ""} />
      </div>
      <div className="mt-[14px]">
        <label className="text-[13px] font-semibold text-[#374151]">
          Special requests <span className="font-medium text-[#9CA3AF]">(optional)</span>
        </label>
        <textarea
          name="specialRequests"
          className="mt-2 min-h-[70px] w-full resize-none rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3 text-[15px] outline-none"
        />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Payment</h2>
      <PaymentMethod />

      {error && <p className="mt-4 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

      <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onCancel}
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
          {pending ? "Creating…" : "Create booking"}
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
