export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Compass,
  ShieldCheck,
  Wallet,
  Headset,
  BadgeCheck,
  Star,
  ArrowRight,
} from "lucide-react";
import { listHotels } from "@/lib/data/hotels";
import { listFeaturedReviews } from "@/lib/data/content";

const values = [
  {
    icon: Compass,
    bg: "#EFF1FF",
    fg: "#7C8CF8",
    title: "Curated hotels",
    text: "Every property on Meridian is hand-checked for design, service and location before it ever goes live.",
  },
  {
    icon: Wallet,
    bg: "#FBF4EA",
    fg: "#D9A441",
    title: "Transparent pricing",
    text: "The price you see is the price you pay — no hidden fees added at checkout, ever.",
  },
  {
    icon: ShieldCheck,
    bg: "#EDFBF3",
    fg: "#4FB878",
    title: "Free cancellation",
    text: "Plans change. Most rooms can be cancelled free of charge up to 48 hours before arrival.",
  },
  {
    icon: BadgeCheck,
    bg: "#EAF6FF",
    fg: "#3FA9F5",
    title: "Verified reviews",
    text: "Every review comes from a guest who actually stayed — no bots, no paid placements.",
  },
  {
    icon: Headset,
    bg: "#FFF3EC",
    fg: "#E88A5A",
    title: "24/7 support",
    text: "A real person is reachable around the clock, before, during and after your stay.",
  },
  {
    icon: Star,
    bg: "#F3F5FF",
    fg: "#4A5AE0",
    title: "Best rate, direct",
    text: "Book directly with us and we match or beat any lower price you find elsewhere.",
  },
];

export default async function AboutPage() {
  const [hotels, testimonials] = await Promise.all([listHotels(), listFeaturedReviews(3)]);

  const ratedHotels = hotels.filter((h) => h.rating > 0);
  const avgRating = ratedHotels.length
    ? (ratedHotels.reduce((sum, h) => sum + h.rating, 0) / ratedHotels.length).toFixed(1)
    : "—";
  const totalReviews = hotels.reduce((sum, h) => sum + h.reviewCount, 0);
  const destinations = new Set(hotels.map((h) => h.country)).size;

  const stats = [
    { label: "Hotels curated", value: `${hotels.length}` },
    { label: "Destinations", value: `${destinations}` },
    { label: "Guest reviews", value: `${totalReviews.toLocaleString()}+` },
    { label: "Average rating", value: avgRating },
  ];

  return (
    <div className="fu">
      {/* HERO */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#7C8CF8 0%,#8FD3FE 60%,#A8E6CF 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(110% 90% at 15% 10%,rgba(255,255,255,.24),transparent 58%)",
          }}
        />
        <div className="relative mx-auto max-w-[1240px] px-8 pt-16 pb-[72px]">
          <div
            className="flex w-fit items-center gap-2 rounded-full px-3.5 py-[7px]"
            style={{
              background: "rgba(255,255,255,.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 14px rgba(16,24,40,.1)",
            }}
          >
            <Compass className="size-[15px] text-[#7C8CF8]" />
            <span className="text-[13px] font-semibold text-[#1F2937]">About Meridian</span>
          </div>
          <h1
            className="mt-[22px] max-w-[640px] text-[52px] leading-[1.02] font-extrabold tracking-[-.035em] text-white"
            style={{ textShadow: "0 2px 20px rgba(16,24,40,.2)" }}
          >
            A calmer way to find and book a stay you&apos;ll actually love
          </h1>
          <p className="mt-4 max-w-[560px] text-lg leading-[1.55] text-white/92">
            Meridian brings together a small, carefully chosen collection of hotels —
            each one visited, vetted, and booked directly through us, with no
            middlemen and no surprises.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-8">
        {/* STATS */}
        <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[20px] border border-[#E7E8EC] bg-white px-5 py-6 text-center"
              style={{ boxShadow: "0 12px 30px rgba(16,24,40,.08)" }}
            >
              <div className="text-3xl font-extrabold tracking-[-.02em] text-[#1F2937]">
                {s.value}
              </div>
              <div className="mt-1.5 text-[13px] font-semibold text-[#9CA3AF]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* STORY */}
        <div className="mt-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
              What we do
            </div>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-.03em]">
              We built the platform we wished existed
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-[#6B7280]">
              Booking a hotel shouldn&apos;t mean sifting through a hundred
              near-identical listings and hidden resort fees. Meridian is a
              booking platform for a small number of hotels we&apos;d actually
              recommend to a friend — from beachfront resorts to alpine lodges
              and city harbor houses.
            </p>
            <p className="mt-3.5 text-[15.5px] leading-[1.7] text-[#6B7280]">
              You search once, compare real rooms with real prices, and book
              directly with the hotel — with our team backing every
              reservation from confirmation to check-out.
            </p>
            <Link
              href="/hotels"
              className="btnp mt-7 inline-flex items-center gap-2 rounded-[13px] px-6 py-3.5 text-[14.5px] font-semibold text-white"
              style={{ background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }}
            >
              Explore our hotels <ArrowRight className="size-[17px]" />
            </Link>
          </div>
          <div
            className="h-[340px] rounded-[26px]"
            style={{
              background: "linear-gradient(135deg,#8FD3FE,#7C8CF8 60%,#A8E6CF)",
              boxShadow: "0 20px 50px rgba(124,140,248,.2)",
            }}
          />
        </div>

        {/* WHAT WE PROVIDE */}
        <div className="pt-24">
          <div className="text-center">
            <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
              What we provide
            </div>
            <h2 className="mt-3 text-4xl font-extrabold tracking-[-.03em]">
              Everything a good stay needs
            </h2>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="lift rounded-[20px] border border-[#E7E8EC] bg-white p-6"
                style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
              >
                <div
                  className="flex size-11 items-center justify-center rounded-[13px]"
                  style={{ background: v.bg }}
                >
                  <v.icon className="size-[21px]" style={{ color: v.fg }} />
                </div>
                <div className="mt-4 text-[15px] font-bold">{v.title}</div>
                <p className="mt-1.5 text-[14px] leading-[1.6] text-[#6B7280]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="pt-24 pb-24">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
                Guest stories
              </div>
              <h2 className="mt-3 text-4xl font-extrabold tracking-[-.03em]">
                Trusted by travellers everywhere
              </h2>
            </div>
            <div
              className="flex items-center gap-2 rounded-2xl border border-[#E7E8EC] bg-white px-[18px] py-3"
              style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
            >
              <Star className="size-[18px] fill-[#F6D68A] text-[#F6D68A]" />
              <span className="text-lg font-extrabold">{avgRating}</span>
              <span className="text-sm font-medium text-[#9CA3AF]">/ 5 average</span>
            </div>
          </div>
          <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-[22px] border border-[#E7E8EC] bg-white p-7"
                style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
              >
                <div className="flex gap-[3px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4"
                      style={
                        i < t.rating
                          ? { fill: "#F6D68A", color: "#F6D68A" }
                          : { fill: "none", color: "#E7E8EC" }
                      }
                    />
                  ))}
                </div>
                <p className="mt-4 text-[15.5px] leading-[1.6] text-[#374151]">{t.comment}</p>
                <div className="mt-[22px] flex items-center gap-3">
                  <div className="size-[42px] rounded-full bg-[#7C8CF8]" />
                  <div>
                    <div className="text-[14.5px] font-bold">
                      {t.booking.contactFirstName} {t.booking.contactLastName}
                    </div>
                    <div className="text-[13px] font-medium text-[#9CA3AF]">
                      {t.hotel.city}, {t.hotel.country}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="relative mb-24 overflow-hidden rounded-[28px] px-8 py-16 text-center"
          style={{
            background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)",
            boxShadow: "0 20px 50px rgba(124,140,248,.24)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(90% 120% at 80% 0%,rgba(255,255,255,.25),transparent 55%)",
            }}
          />
          <div className="relative">
            <h2 className="m-0 text-[44px] font-extrabold tracking-[-.03em] text-white">
              Ready to find your stay?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Browse our hotels and book directly, at the best rate, in minutes.
            </p>
            <Link
              href="/hotels"
              className="btns mt-[30px] inline-block rounded-[15px] bg-white px-8 py-4 text-base font-bold text-[#1F2937]"
              style={{ boxShadow: "0 8px 24px rgba(16,24,40,.16)" }}
            >
              View all hotels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
