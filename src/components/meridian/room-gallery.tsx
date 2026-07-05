"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Play } from "lucide-react";
import { isVideoUrl } from "@/lib/media";

const EXTRA_GRADIENTS = [
  "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
  "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
  "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
  "linear-gradient(135deg,#CFEAFE,#8FD3FE)",
  "linear-gradient(135deg,#F7D9C4,#7C8CF8)",
];

type Slide = { url: string; isVideo: boolean } | { gradient: string };

export function RoomGallery({ room }: { room: { gradient: string; images?: { url: string }[] } }) {
  const realMedia = room.images?.map((img) => img.url) ?? [];
  const hasRealMedia = realMedia.length > 0;
  const slides: Slide[] = hasRealMedia
    ? realMedia.map((url) => ({ url, isVideo: isVideoUrl(url) }))
    : [room.gradient, ...EXTRA_GRADIENTS].map((gradient) => ({ gradient }));
  const [index, setIndex] = useState(0);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  const thumb1 = (index + 1) % slides.length;
  const thumb2 = (index + 2) % slides.length;
  const remaining = slides.length - 3;

  return (
    <div className="mt-5 grid h-auto grid-cols-1 gap-3 md:h-[440px] md:grid-cols-[2fr_1fr]">
      <div
        className="relative overflow-hidden rounded-[22px]"
        style={"gradient" in slides[index] ? { background: slides[index].gradient } : undefined}
      >
        <MediaSlide slide={slides[index]} large />
        <div
          className="absolute bottom-[18px] left-[18px] flex items-center gap-[7px] rounded-full bg-white/94 px-3.5 py-2 text-[13px] font-semibold"
          style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.12)" }}
        >
          <ImageIcon className="size-[15px] text-[#7C8CF8]" />
          {index + 1} / {slides.length}
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
          aria-label="View media"
          className="relative cursor-pointer overflow-hidden rounded-[22px]"
          style={"gradient" in slides[thumb1] ? { background: slides[thumb1].gradient } : undefined}
        >
          <MediaSlide slide={slides[thumb1]} />
        </button>
        <button
          type="button"
          onClick={() => setIndex(thumb2)}
          aria-label="View media"
          className="relative cursor-pointer overflow-hidden rounded-[22px]"
          style={"gradient" in slides[thumb2] ? { background: slides[thumb2].gradient } : undefined}
        >
          <MediaSlide slide={slides[thumb2]} />
          {remaining > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(16,24,40,.35)] text-base font-bold text-white">
              +{remaining} photos
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function MediaSlide({ slide, large = false }: { slide: Slide; large?: boolean }) {
  if ("gradient" in slide) return null;

  if (slide.isVideo) {
    return large ? (
      <video src={slide.url} controls className="size-full object-cover" />
    ) : (
      <div className="flex size-full items-center justify-center bg-[#1F2937]">
        <Play className="size-6 fill-white text-white" />
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- remote user-uploaded media, arbitrary hosts
  return <img src={slide.url} alt="" className="size-full object-cover" />;
}
