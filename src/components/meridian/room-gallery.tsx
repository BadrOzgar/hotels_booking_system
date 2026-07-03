"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import type { Room } from "@/lib/meridian-data";

const EXTRA_GRADIENTS = [
  "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
  "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
  "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
  "linear-gradient(135deg,#CFEAFE,#8FD3FE)",
  "linear-gradient(135deg,#F7D9C4,#7C8CF8)",
];

export function RoomGallery({ room }: { room: Room }) {
  const images = [room.gradient, ...EXTRA_GRADIENTS];
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  const thumb1 = (index + 1) % images.length;
  const thumb2 = (index + 2) % images.length;
  const remaining = images.length - 3;

  return (
    <div className="mt-5 grid h-auto grid-cols-1 gap-3 md:h-[440px] md:grid-cols-[2fr_1fr]">
      <div
        className="relative rounded-[22px]"
        style={{ background: images[index], boxShadow: "0 10px 30px rgba(16,24,40,.08)" }}
      >
        <div
          className="absolute bottom-[18px] left-[18px] flex items-center gap-[7px] rounded-full bg-white/94 px-3.5 py-2 text-[13px] font-semibold"
          style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.12)" }}
        >
          <ImageIcon className="size-[15px] text-[#7C8CF8]" />
          {index + 1} / {images.length}
        </div>
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute top-1/2 left-[18px] flex size-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/94"
          style={{ boxShadow: "0 2px 10px rgba(16,24,40,.14)" }}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute top-1/2 right-[18px] flex size-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/94"
          style={{ boxShadow: "0 2px 10px rgba(16,24,40,.14)" }}
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="grid grid-rows-2 gap-3">
        <button
          type="button"
          onClick={() => setIndex(thumb1)}
          aria-label="View photo"
          className="cursor-pointer rounded-[22px]"
          style={{ background: images[thumb1] }}
        />
        <button
          type="button"
          onClick={() => setIndex(thumb2)}
          aria-label="View photo"
          className="relative cursor-pointer rounded-[22px]"
          style={{ background: images[thumb2] }}
        >
          {remaining > 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-[22px] bg-[rgba(16,24,40,.35)] text-base font-bold text-white">
              +{remaining} photos
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
