"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Check, Video, X } from "lucide-react";
import { useDrawerForm } from "@/hooks/use-drawer-form";
import { MEDIA_ACCEPT, isVideoUrl } from "@/lib/media";

type Amenity = { id: string; label: string };
type MediaItem = { id: string; url: string; isCover: boolean };

/** Generates (and cleans up) blob preview URLs for files the user just picked, before they're uploaded. */
function usePreviewUrls(files: File[]): string[] {
  const urls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [urls]);

  return urls;
}

const STATUS_OPTIONS = ["AVAILABLE", "OCCUPIED", "MAINTENANCE", "HIDDEN"] as const;

type RoomTypeFormValues = {
  name: string;
  category: string;
  description: string;
  basePricePerNight: number;
  capacity: number;
  sizeSqm: number | null;
  bathrooms: number;
  unitNumber: string;
  status: (typeof STATUS_OPTIONS)[number];
  amenityIds: string[];
  images?: MediaItem[];
};

export function RoomTypeForm({
  action,
  amenities,
  initial,
  submitLabel,
  onSuccess,
  onCancel,
  onDeleteImage,
}: {
  action: (formData: FormData) => Promise<string | undefined>;
  amenities: Amenity[];
  initial?: RoomTypeFormValues;
  submitLabel: string;
  onSuccess: () => void;
  onCancel: () => void;
  onDeleteImage?: (imageId: string) => Promise<void>;
}) {
  const { error, pending, submit } = useDrawerForm(action, onSuccess);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>(initial?.status ?? "AVAILABLE");
  const [images, setImages] = useState<MediaItem[]>(initial?.images ?? []);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedAmenityIds = initial?.amenityIds ?? [];

  const pendingPreviews = usePreviewUrls(pendingFiles);

  function syncFileInput(files: File[]) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const newFiles = Array.from(e.target.files ?? []);
    if (newFiles.length === 0) return;
    const combined = [...pendingFiles, ...newFiles];
    setPendingFiles(combined);
    syncFileInput(combined);
  }

  function removePending(index: number) {
    const next = pendingFiles.filter((_, i) => i !== index);
    setPendingFiles(next);
    syncFileInput(next);
  }

  async function handleDelete(imageId: string) {
    if (!onDeleteImage) return;
    setDeletingId(imageId);
    try {
      await onDeleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <form action={submit}>
      <div className="mb-[18px]">
        <label className="text-[13px] font-semibold text-[#374151]">Photos &amp; videos</label>
        {(images.length > 0 || pendingFiles.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-2.5">
            {images.map((img) => (
              <div key={img.id} className="group relative size-16 shrink-0 overflow-hidden rounded-xl border border-[#E7E8EC]">
                {isVideoUrl(img.url) ? (
                  <div className="flex size-full items-center justify-center bg-[#F3F5FF]">
                    <Video className="size-5 text-[#7C8CF8]" />
                  </div>
                ) : (
                  <Image src={img.url} alt="" width={64} height={64} className="size-full object-cover" />
                )}
                {img.isCover && (
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-[#4A5AE0] px-1 py-px text-[9px] font-bold text-white">
                    Cover
                  </span>
                )}
                {onDeleteImage && (
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId === img.id}
                    aria-label="Remove media"
                    className="absolute top-0.5 right-0.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-50"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
            {pendingFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="relative size-16 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-[#C9D1FB]"
              >
                {file.type.startsWith("video/") ? (
                  <div className="flex size-full items-center justify-center bg-[#F3F5FF]">
                    <Video className="size-5 text-[#7C8CF8]" />
                  </div>
                ) : (
                  // next/image can't optimize blob: URLs — this is a local, pre-upload preview only.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={pendingPreviews[i]} alt="" className="size-full object-cover" />
                )}
                {images.length === 0 && i === 0 && (
                  <span className="absolute bottom-0.5 left-0.5 rounded bg-[#4A5AE0] px-1 py-px text-[9px] font-bold text-white">
                    Cover
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-black/55 px-1 py-px text-center text-[9px] font-bold text-white">
                  New
                </span>
                <button
                  type="button"
                  onClick={() => removePending(i)}
                  aria-label="Remove"
                  className="absolute top-0.5 right-0.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          name="media"
          type="file"
          accept={MEDIA_ACCEPT}
          multiple
          onChange={handleFilesSelected}
          className="mt-2.5 w-full text-[13.5px] text-[#6B7280] file:mr-3 file:rounded-lg file:border-0 file:bg-[#F3F5FF] file:px-3.5 file:py-2 file:text-[13px] file:font-semibold file:text-[#4A5AE0]"
        />
        <p className="mt-1.5 text-[12px] font-medium text-[#9CA3AF]">
          Add as many photos and videos as you like — the first one uploaded becomes the cover. New items are
          previewed here until you save.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
        <Field label="Room title" name="name" defaultValue={initial?.name} placeholder="Tide Suite" />
        <Field label="Room type" name="category" defaultValue={initial?.category} placeholder="Suite" />

        <div className="sm:col-span-2">
          <label className="text-[13px] font-semibold text-[#374151]">Description</label>
          <textarea
            name="description"
            defaultValue={initial?.description}
            required
            className="mt-2 min-h-[90px] w-full resize-none rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
          />
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#374151]">Price / night</label>
          <div className="relative mt-2">
            <input
              name="basePricePerNight"
              type="number"
              min={1}
              step="0.01"
              defaultValue={initial?.basePricePerNight ?? 200}
              required
              className="w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] py-3 pr-14 pl-3.5 text-[15px] outline-none"
            />
            <span className="absolute top-1/2 right-3.5 -translate-y-1/2 text-[13px] font-semibold text-[#9CA3AF]">
              MAD
            </span>
          </div>
        </div>
        <Field label="Room number" name="unitNumber" defaultValue={initial?.unitNumber} placeholder="204" />
        <Field label="Capacity (guests)" name="capacity" type="number" min={1} defaultValue={initial?.capacity ?? 2} />
        <Field label="Room size (m²)" name="sizeSqm" type="number" min={0} defaultValue={initial?.sizeSqm ?? undefined} required={false} />
        <Field label="Bathrooms" name="bathrooms" type="number" min={0} defaultValue={initial?.bathrooms ?? 1} />
      </div>

      <div className="mt-[18px]">
        <label className="text-[13px] font-semibold text-[#374151]">Amenities</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {amenities.map((a) => {
            const defaultChecked = selectedAmenityIds.includes(a.id);
            return (
              <label
                key={a.id}
                className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-[#E7E8EC] px-3.5 py-2 text-[13px] font-semibold text-[#6B7280] has-checked:border-[#C9D1FB] has-checked:bg-[#F3F5FF] has-checked:text-[#4A5AE0]"
              >
                <input type="checkbox" name="amenityIds" value={a.id} defaultChecked={defaultChecked} className="peer sr-only" />
                <Check className="hidden size-3.5 peer-checked:inline" />
                {a.label}
              </label>
            );
          })}
        </div>
      </div>

      <div className="mt-[18px]">
        <label className="text-[13px] font-semibold text-[#374151]">Status</label>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setStatus(s)}
              className="flex cursor-pointer items-center gap-[7px] rounded-[11px] border px-4 py-2.5 text-[13px] font-semibold"
              style={
                status === s
                  ? { borderColor: "#7C8CF8", background: "#F3F5FF", color: "#4A5AE0" }
                  : { borderColor: "#E7E8EC", background: "#fff", color: "#6B7280" }
              }
            >
              <span className="size-[7px] rounded-full" style={{ background: status === s ? "#7C8CF8" : "#D8DAE2" }} />
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <input type="hidden" name="status" value={status} />
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
          disabled={pending}
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
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        required={required}
        min={min}
        className="mt-2 w-full rounded-xl border border-[#E7E8EC] bg-[#FCFCFD] px-3.5 py-3 text-[15px] outline-none"
      />
    </div>
  );
}
