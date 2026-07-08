export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  Waves,
  Utensils,
  Flower2,
  Dumbbell,
  Wifi,
  SquareParking,
  Star,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Hero } from "@/components/meridian/hero";
import { SearchCard } from "@/components/meridian/search-card";
import { RoomCard } from "@/components/meridian/room-card";
import { PricingSection } from "@/components/meridian/pricing-section";
import { getFeaturedRoomTypes } from "@/lib/data/room-types";
import { listHotelLevelAmenities, listFaqs, listFeaturedReviews } from "@/lib/data/content";
import { listDestinationSuggestions } from "@/lib/data/hotels";

const amenityIcons: Record<string, typeof Waves> = {
  waves: Waves,
  utensils: Utensils,
  flower: Flower2,
  dumbbell: Dumbbell,
  wifi: Wifi,
  parking: SquareParking,
};

const amenityColors: Record<string, { bg: string; fg: string }> = {
  waves: { bg: "#EAF6FF", fg: "#3FA9F5" },
  utensils: { bg: "#FFF3EC", fg: "#E88A5A" },
  flower: { bg: "#EDFBF3", fg: "#4FB878" },
  dumbbell: { bg: "#EFF1FF", fg: "#7C8CF8" },
  wifi: { bg: "#EAF6FF", fg: "#3FA9F5" },
  parking: { bg: "#FBF4EA", fg: "#D9A441" },
};

export default async function LandingPage() {
  const [featured, amenities, faqs, testimonials, destinations] = await Promise.all([
    getFeaturedRoomTypes(3),
    listHotelLevelAmenities(),
    listFaqs(),
    listFeaturedReviews(3),
    listDestinationSuggestions(),
  ]);

  const avgRating = testimonials.length
    ? Math.round((testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length) * 10) / 10
    : 0;

  return (
    <div className="fu mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <Hero />
      <SearchCard destinations={destinations} />

      {/* FEATURED ROOMS */}
      <div className="pt-14 sm:pt-16 md:pt-[88px]">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
              Featured stays
            </div>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-.03em] sm:text-3xl md:text-4xl">
              Rooms designed to slow you down
            </h2>
          </div>
          <Link
            href="/rooms"
            className="btns flex items-center gap-2 rounded-[13px] border border-[#E7E8EC] bg-white px-5 py-3 text-[14.5px] font-semibold text-[#1F2937]"
          >
            View all rooms <ArrowRight className="size-[17px]" />
          </Link>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      {/* AMENITIES */}
      <div className="pt-16 sm:pt-20 md:pt-24">
        <div className="text-center">
          <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
            The resort
          </div>
          <h2 className="mt-3 text-[28px] font-extrabold tracking-[-.03em] sm:text-3xl md:text-4xl">
            Everything, within a barefoot walk
          </h2>
        </div>
        <div className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {amenities.map((a) => {
            const Icon = amenityIcons[a.icon ?? ""] ?? Waves;
            const colors = amenityColors[a.icon ?? ""] ?? { bg: "#F3F5FF", fg: "#7C8CF8" };
            return (
              <div
                key={a.id}
                className="lift rounded-[20px] border border-[#E7E8EC] bg-white px-[18px] py-[26px] text-center"
                style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
              >
                <div
                  className="mx-auto flex size-[52px] items-center justify-center rounded-[15px]"
                  style={{ background: colors.bg }}
                >
                  <Icon className="size-6" style={{ color: colors.fg }} />
                </div>
                <div className="mt-3.5 text-[15px] font-semibold">{a.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <div className="pt-16 sm:pt-20 md:pt-24">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
                Guest stories
              </div>
              <h2 className="mt-3 text-[28px] font-extrabold tracking-[-.03em] sm:text-3xl md:text-4xl">
                Loved by real travellers
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
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <div className="grid grid-cols-1 gap-10 pt-16 sm:pt-20 md:grid-cols-[.8fr_1.2fr] md:gap-14 md:pt-24">
          <div>
            <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
              Good to know
            </div>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-.03em] sm:text-[32px] md:text-[38px]">
              Questions,
              <br />
              answered
            </h2>
            <p className="mt-4 text-[15.5px] leading-[1.6] text-[#6B7280]">
              Everything you need before you arrive. Still curious? Our front desk
              replies within the hour.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-[#E7E8EC] bg-white px-6 py-[22px]"
                style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold">{f.question}</span>
                  <Plus className="size-[19px] text-[#9CA3AF]" />
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-[#6B7280]">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRICING */}
      <PricingSection />

      {/* CTA */}
      <div
        className="relative mt-16 overflow-hidden rounded-2xl px-5 py-10 text-center sm:mt-20 sm:rounded-[28px] sm:px-8 sm:py-16 md:mt-24"
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
          <h2 className="m-0 text-[28px] font-extrabold tracking-[-.03em] text-white sm:text-[34px] md:text-[44px]">
            Your table by the sea is ready
          </h2>
          <p className="mt-4 text-[15px] text-white/90 sm:text-lg">
            Book direct for the best rate and a complimentary breakfast.
          </p>
          <Link
            href="/rooms"
            className="btns mt-[30px] inline-block w-full rounded-[15px] bg-white px-8 py-4 text-base font-bold text-[#1F2937] sm:w-auto"
            style={{ boxShadow: "0 8px 24px rgba(16,24,40,.16)" }}
          >
            Check availability
          </Link>
        </div>
      </div>
    </div>
  );
}
