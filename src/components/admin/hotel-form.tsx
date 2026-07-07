"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, Video, Loader2 } from "lucide-react";
import { useDrawerForm } from "@/hooks/use-drawer-form";
import { MEDIA_ACCEPT, isVideoUrl } from "@/lib/media";
import { compressImageFile } from "@/lib/compress-image";

type Amenity = { id: string; label: string };

type HotelFormValues = {
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

export function HotelForm({
  action,
  amenities,
  initial,
  submitLabel,
  onSuccess,
  onCancel,
}: {
  action: (formData: FormData) => Promise<string | undefined>;
  amenities: Amenity[];
  initial?: HotelFormValues;
  submitLabel: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { error, pending, submit } = useDrawerForm(action, onSuccess);
  const selectedAmenityIds = initial?.amenityIds ?? [];
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      const compressed = await compressImageFile(file);
      const dt = new DataTransfer();
      dt.items.add(compressed);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
    } finally {
      setCompressing(false);
    }
  }

  return (
    <form action={submit}>
      <div className="mb-[18px]">
        <label className="text-[13px] font-semibold text-[#374151]">Cover photo or video</label>
        <div className="mt-2 flex items-center gap-3">
          {initial?.coverImageUrl &&
            (isVideoUrl(initial.coverImageUrl) ? (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#F3F5FF]">
                <Video className="size-5 text-[#7C8CF8]" />
              </div>
            ) : (
              <Image
                src={initial.coverImageUrl}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-xl object-cover"
              />
            ))}
          <input
            ref={fileInputRef}
            name="coverImage"
            type="file"
            accept={MEDIA_ACCEPT}
            disabled={compressing}
            onChange={handleFileSelected}
            className="flex-1 text-[13.5px] text-[#6B7280] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F3F5FF] file:px-3.5 file:py-2 file:text-[13px] file:font-semibold file:text-[#4A5AE0] disabled:opacity-60"
          />
          {compressing && <Loader2 className="size-4 shrink-0 animate-spin text-[#7C8CF8]" />}
        </div>
      </div>

      <h2 className="text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Basic info</h2>
      <div className="mt-3 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Hotel name" name="name" defaultValue={initial?.name} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[13px] font-semibold text-[#374151]">Description</label>
          <textarea
            name="description"
            defaultValue={initial?.description}
            required
            className="mt-2 min-h-[90px] w-full resize-none rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
          />
        </div>
        <Field label="Badge / tag" name="tag" defaultValue={initial?.tag ?? ""} placeholder="e.g. Beachfront" required={false} />
        <Field label="Star rating (0–5)" name="starRating" type="number" min={0} max={5} defaultValue={initial?.starRating ?? 4} />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Location</h2>
      <div className="mt-3 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <Field label="City" name="city" defaultValue={initial?.city} />
        <Field label="Country" name="country" defaultValue={initial?.country} />
        <div className="sm:col-span-2">
          <Field label="Address" name="address" defaultValue={initial?.address} />
        </div>
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Policies &amp; pricing</h2>
      <div className="mt-3 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <Field label="Currency" name="currency" defaultValue={initial?.currency ?? "MAD"} />
        <Field label="Check-in time" name="checkInTime" defaultValue={initial?.checkInTime ?? "15:00"} />
        <Field label="Check-out time" name="checkOutTime" defaultValue={initial?.checkOutTime ?? "11:00"} />
        <Field
          label="Service fee (MAD)"
          name="serviceFeeCents"
          type="number"
          min={0}
          defaultValue={initial ? initial.serviceFeeCents / 100 : 48}
          transformToCents
        />
        <Field label="Tax rate (%)" name="taxRatePercent" type="number" step="0.1" min={0} max={100} defaultValue={initial?.taxRatePercent ?? 12} />
        <Field label="Free cancellation (hours)" name="freeCancellationHours" type="number" min={0} defaultValue={initial?.freeCancellationHours ?? 48} />
        <Field label="Cancellation penalty (nights)" name="penaltyNights" type="number" min={0} defaultValue={initial?.penaltyNights ?? 1} />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Contact information</h2>
      <div className="mt-3 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <Field label="Contact email" name="contactEmail" type="email" defaultValue={initial?.contactEmail ?? ""} required={false} />
        <Field label="Contact phone" name="contactPhone" defaultValue={initial?.contactPhone ?? ""} required={false} />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">Amenities</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {amenities.map((a) => {
          const defaultChecked = selectedAmenityIds.includes(a.id);
          return (
            <label
              key={a.id}
              className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E7E8EC] px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] has-checked:border-[#C9D1FB] has-checked:bg-[#F3F5FF] has-checked:text-[#4A5AE0]"
            >
              <input
                type="checkbox"
                name="amenityIds"
                value={a.id}
                defaultChecked={defaultChecked}
                className="peer sr-only"
              />
              <Check className="hidden size-3.5 peer-checked:inline" />
              {a.label}
            </label>
          );
        })}
      </div>

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
          disabled={pending || compressing}
          className="btnp flex items-center justify-center gap-2 rounded-[13px] px-[26px] py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required = true,
  min,
  max,
  step,
  transformToCents,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string;
  transformToCents?: boolean;
}) {
  // serviceFeeCents is edited in whole MAD for usability; a hidden field carries the real cents (centime) value.
  if (transformToCents) {
    return (
      <div>
        <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
        <input
          type="number"
          min={min}
          defaultValue={defaultValue}
          onChange={(e) => {
            const hidden = e.currentTarget.form?.elements.namedItem(name) as HTMLInputElement | null;
            if (hidden) hidden.value = String(Math.round(Number(e.currentTarget.value || 0) * 100));
          }}
          className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
        />
        <input
          type="hidden"
          name={name}
          defaultValue={Math.round(Number(defaultValue || 0) * 100)}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
      />
    </div>
  );
}
