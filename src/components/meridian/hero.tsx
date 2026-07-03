"use client";

import { MapPin } from "lucide-react";

export function Hero() {
  return (
    <div>
      <div
        className="fu relative mt-3 overflow-hidden rounded-[28px]"
        style={{ boxShadow: "0 20px 50px rgba(16,24,40,.12)" }}
      >
        <div
          className="relative h-[560px]"
          style={{ background: "linear-gradient(135deg,#8FD3FE 0%,#7C8CF8 55%,#A8E6CF 100%)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 20% 10%,rgba(255,255,255,.28),transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg,rgba(16,24,40,.05),rgba(16,24,40,.34))",
            }}
          />
          <div className="relative flex h-full max-w-[640px] flex-col justify-center px-[60px] py-14">
            <div
              className="flex w-fit items-center gap-2 rounded-full px-3.5 py-[7px]"
              style={{
                background: "rgba(255,255,255,.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 14px rgba(16,24,40,.1)",
              }}
            >
              <MapPin className="size-[15px] text-[#7C8CF8]" />
              <span className="text-[13px] font-semibold text-[#1F2937]">
                Half Moon Bay &middot; California Coast
              </span>
            </div>
            <h1
              className="mt-[22px] text-[60px] leading-[1.02] font-extrabold tracking-[-.035em] text-white"
              style={{ textShadow: "0 2px 24px rgba(16,24,40,.24)" }}
            >
              Where the day
              <br />
              meets the water.
            </h1>
            <p className="mt-5 max-w-[460px] text-lg leading-[1.55] text-white/92">
              A calm, light-filled coastal retreat. Thoughtful rooms, an unhurried
              pace, and the ocean at the edge of everything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
