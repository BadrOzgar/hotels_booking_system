"use client";

import { useActionState, useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { signupAction } from "@/app/signup/actions";
import { usePreviewUrls } from "@/hooks/use-preview-urls";
import { compressImageFile } from "@/lib/compress-image";

const MAX_IMAGES = 3;

export function SignupForm() {
  const [error, action, pending] = useActionState(signupAction, undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previews = usePreviewUrls(files);

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
        <div className="grid grid-cols-2 gap-[14px]">
          <Field label="City" name="city" placeholder="Big Sur" />
          <Field label="Country" name="country" placeholder="United States" />
        </div>
        <Field label="Address" name="address" placeholder="1 Cliff Road" />

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
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        minLength={type === "password" ? 8 : undefined}
        className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
      />
    </div>
  );
}
