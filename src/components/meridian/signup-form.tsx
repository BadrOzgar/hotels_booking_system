"use client";

import { useActionState, useRef, useState } from "react";
import { ImagePlus, X, Loader2, MapPin } from "lucide-react";
import { signupAction, previewSignupMapsLinkAction, type ResolvedMapsLink } from "@/app/signup/actions";
import { usePreviewUrls } from "@/hooks/use-preview-urls";
import { compressImageFile } from "@/lib/compress-image";
import { LocationMap } from "@/components/meridian/location-map";

const MAX_IMAGES = 3;

export function SignupForm() {
  const [error, action, pending] = useActionState(signupAction, undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previews = usePreviewUrls(files);

  const [mapsLink, setMapsLink] = useState("");
  const [preview, setPreview] = useState<ResolvedMapsLink | null>(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  async function handleLocate() {
    if (!mapsLink.trim()) return;
    setLocating(true);
    setLocateError(null);
    try {
      const resolved = await previewSignupMapsLinkAction(mapsLink);
      if (!resolved) {
        setPreview(null);
        setLocateError("Couldn't read a location from that link — check it's a valid Google Maps link.");
      } else {
        setPreview(resolved);
      }
    } finally {
      setLocating(false);
    }
  }

  function syncFileInput(next: File[]) {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
  }

  async function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).slice(0, MAX_IMAGES - files.length);
    if (picked.length === 0) return;
    setCompressing(true);
    try {
      // Shrink each photo client-side before it ever touches FormData/the network — a raw phone
      // photo can be 8-15MB, which is what makes an upload feel stuck on a slow connection.
      const compressed = await Promise.all(picked.map((f) => compressImageFile(f)));
      const combined = [...files, ...compressed].slice(0, MAX_IMAGES);
      setFiles(combined);
      syncFileInput(combined);
    } finally {
      setCompressing(false);
    }
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    syncFileInput(next);
  }

  return (
    <form action={action}>
      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">
        Your details
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <Field label="Full name" name="ownerName" placeholder="Amara Okafor" />
        <Field label="Email" name="email" type="email" placeholder="you@hotel.com" />
      </div>
      <div className="mt-[14px]">
        <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">
        Your hotel
      </h2>
      <div className="mt-3 flex flex-col gap-[14px]">
        <Field label="Hotel name" name="hotelName" placeholder="Cliffside Inn" />
        <div>
          <label className="text-[13px] font-semibold text-[#374151]">Google Maps link</label>
          <div className="mt-2 flex items-center gap-2">
            <input
              name="mapsLink"
              value={mapsLink}
              onChange={(e) => setMapsLink(e.target.value)}
              placeholder="Paste a Google Maps link"
              required
              className="flex-1 rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
            />
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating || !mapsLink.trim()}
              className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[13px] border border-[#E7E8EC] bg-white px-4 py-3.5 text-[13.5px] font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locating ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}
              {locating ? "Locating…" : "Locate"}
            </button>
          </div>
          <p className="mt-1.5 text-[12px] font-medium text-[#9CA3AF]">
            Open your hotel&apos;s exact location in Google Maps, share it, and paste the link
            here — we use it to pin your hotel precisely on the map.
          </p>
          {locateError && <p className="mt-1.5 text-[12.5px] font-medium text-[#D96A6A]">{locateError}</p>}
          {preview && (
            <>
              <p className="mt-2.5 text-[13px] font-semibold text-[#374151]">
                Detected: {preview.address}, {preview.city}, {preview.country}
              </p>
              <div className="mt-2 h-[180px] overflow-hidden rounded-xl border border-[#E7E8EC]">
                <LocationMap lat={preview.lat} lng={preview.lng} label="Map preview" zoom={14} />
              </div>
            </>
          )}
        </div>

        <div>
          <label className="text-[13px] font-semibold text-[#374151]">
            Hotel photos <span className="font-medium text-[#9CA3AF]">(up to 3, optional)</span>
          </label>
          {files.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2.5">
              {files.map((file, i) => (
                <div key={`${file.name}-${i}`} className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-[#E7E8EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a next/image-compatible remote URL */}
                  <img src={previews[i]} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label="Remove photo"
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
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          {files.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressing}
              className="mt-2.5 flex cursor-pointer items-center gap-2 rounded-[13px] border border-dashed border-[#D8DAE2] bg-[#FCFCFD] px-4 py-3 text-[13.5px] font-semibold text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {compressing ? (
                <Loader2 className="size-[17px] animate-spin text-[#7C8CF8]" />
              ) : (
                <ImagePlus className="size-[17px] text-[#7C8CF8]" />
              )}
              {compressing ? "Processing photos…" : "Add photos of your property"}
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

      <button
        type="submit"
        disabled={pending || compressing}
        className="btnp mt-6 w-full rounded-2xl py-[15px] text-base font-bold text-white disabled:opacity-60"
        style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
      >
        {pending
          ? files.length > 0
            ? "Uploading photos & creating your workspace…"
            : "Creating your workspace…"
          : "Create my hotel workspace"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (next: string) => void;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={onChange ? value : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required
        minLength={type === "password" ? 8 : undefined}
        className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
      />
    </div>
  );
}
