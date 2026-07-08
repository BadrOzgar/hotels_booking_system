import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN_PRICES } from "@/lib/data/platform";
import { formatCurrency } from "@/lib/pricing";

type Plan = {
  key: keyof typeof PLAN_PRICES;
  name: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
};

const PLANS: Plan[] = [
  {
    key: "TRIAL",
    name: "Trial",
    tagline: "Try Meridian free for 14 days",
    features: [
      "Up to 5 rooms",
      "Booking & calendar management",
      "Guest directory",
      "Email support",
    ],
  },
  {
    key: "BASIC",
    name: "Basic",
    tagline: "For independent hotels finding their footing",
    features: [
      "Up to 25 rooms",
      "Everything in Trial",
      "Booking source tracking (direct, phone, walk-in)",
      "Standard support",
    ],
    highlighted: true,
  },
  {
    key: "PRO",
    name: "Pro",
    tagline: "For growing properties and portfolios",
    features: [
      "Unlimited rooms",
      "Everything in Basic",
      "Revenue & occupancy analytics",
      "Priority support",
    ],
  },
];

export function PricingSection() {
  return (
    <div className="pt-16 sm:pt-20 md:pt-24">
      <div className="text-center">
        <div className="text-[13px] font-bold tracking-[.08em] text-[#7C8CF8] uppercase">
          For hotel owners
        </div>
        <h2 className="mt-3 text-[28px] font-extrabold tracking-[-.03em] sm:text-3xl md:text-4xl">
          Simple pricing, no surprises
        </h2>
        <p className="mx-auto mt-3.5 max-w-[520px] text-[15px] leading-[1.6] text-[#6B7280] sm:text-[15.5px]">
          List your property on Meridian and manage bookings, guests, and revenue from one
          dashboard. Start free, upgrade whenever you&apos;re ready.
        </p>
      </div>

      <div className="mt-11 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const price = PLAN_PRICES[plan.key];
          return (
            <div
              key={plan.key}
              className={plan.highlighted ? "lift relative rounded-[22px] p-7 text-white" : "lift relative rounded-[22px] border border-[#E7E8EC] bg-white p-7"}
              style={
                plan.highlighted
                  ? { background: "linear-gradient(135deg,#7C8CF8,#8FD3FE)", boxShadow: "0 20px 45px rgba(124,140,248,.28)" }
                  : { boxShadow: "0 1px 2px rgba(16,24,40,.04)" }
              }
            >
              {plan.highlighted && (
                <span className="absolute top-7 right-7 rounded-full bg-white/22 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[.04em]">
                  Most popular
                </span>
              )}

              <h3
                className="text-lg font-bold tracking-[-.01em]"
                style={{ color: plan.highlighted ? "#fff" : "#1F2937" }}
              >
                {plan.name}
              </h3>
              <p
                className="mt-1.5 text-[13.5px] font-medium"
                style={{ color: plan.highlighted ? "rgba(255,255,255,.85)" : "#9CA3AF" }}
              >
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-[38px] font-extrabold tracking-[-.02em]">
                  {price === 0 ? "Free" : formatCurrency(price)}
                </span>
                {price > 0 && (
                  <span
                    className="text-[14px] font-medium"
                    style={{ color: plan.highlighted ? "rgba(255,255,255,.85)" : "#9CA3AF" }}
                  >
                    / month
                  </span>
                )}
              </div>

              <div className="my-6 h-px" style={{ background: plan.highlighted ? "rgba(255,255,255,.25)" : "#F0F1F4" }} />

              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[14.5px] font-medium">
                    <span
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: plan.highlighted ? "rgba(255,255,255,.22)" : "#F3F5FF" }}
                    >
                      <Check className="size-3" style={{ color: plan.highlighted ? "#fff" : "#7C8CF8" }} />
                    </span>
                    <span style={{ color: plan.highlighted ? "rgba(255,255,255,.95)" : "#374151" }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={plan.highlighted ? "btns mt-7 block rounded-[13px] bg-white py-3.5 text-center text-[15px] font-bold text-[#1F2937]" : "btnp mt-7 block rounded-[13px] py-3.5 text-center text-[15px] font-semibold text-white"}
                style={
                  plan.highlighted
                    ? { boxShadow: "0 8px 20px rgba(16,24,40,.14)" }
                    : { background: "#7C8CF8", boxShadow: "0 4px 14px rgba(124,140,248,.28)" }
                }
              >
                Get started
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
