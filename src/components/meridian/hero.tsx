"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

export function Hero() {
  return (
    <div>
      <div
        className="fu relative mt-3 overflow-hidden rounded-2xl sm:rounded-[28px]"
        style={{ boxShadow: "0 20px 50px rgba(16,24,40,.12)" }}
      >
        <div className="relative h-[420px] sm:h-[480px] md:h-[520px] lg:h-[560px]">
          <Image src="/hero_section.png" alt="" fill priority sizes="100vw" className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,rgba(16,24,40,.62) 0%,rgba(16,24,40,.32) 40%,transparent 68%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(16,24,40,.08),rgba(16,24,40,.3))",
            }}
          />
          <div className="relative flex h-full max-w-[640px] flex-col justify-center px-5 py-10 sm:px-8 md:px-12 lg:px-[60px] lg:py-14">
            <div
              className="flex w-fit items-center gap-2 rounded-full px-3 py-1.5 sm:px-3.5 sm:py-[7px]"
              style={{
                background: "rgba(255,255,255,.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 14px rgba(16,24,40,.1)",
              }}
            >
              <MapPin className="size-[15px] shrink-0 text-[#7C8CF8]" />
              <span className="text-[12.5px] font-semibold text-[#1F2937] sm:text-[13px]">
                Half Moon Bay &middot; California Coast
              </span>
            </div>
            <h1
              className="mt-4 text-[clamp(2rem,6.5vw,3.75rem)] leading-[1.05] font-extrabold tracking-[-.035em] text-white sm:mt-[22px] sm:leading-[1.02]"
              style={{ textShadow: "0 2px 24px rgba(16,24,40,.24)" }}
            >
              Where the day
              <br />
              meets the water.
            </h1>
            <p className="mt-4 max-w-[460px] text-[15px] leading-[1.55] text-white/92 sm:mt-5 sm:text-lg">
              A calm, light-filled coastal retreat. Thoughtful rooms, an unhurried
              pace, and the ocean at the edge of everything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
