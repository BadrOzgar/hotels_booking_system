import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck } from "lucide-react";
import { getRoom, rooms, roomPricing } from "@/lib/meridian-data";
import { PaymentMethod } from "@/components/meridian/payment-method";

export function generateStaticParams() {
  return rooms.map((r) => ({ id: r.id }));
}

export default async function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const room = getRoom(id);
  if (!room) notFound();

  const { base, tax, total, nights } = roomPricing(room.price);

  return (
    <div className="fu mx-auto max-w-[1080px] px-8 pt-8 pb-20">
      <Link
        href={`/rooms/${room.id}`}
        className="navlink inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280]"
      >
        <ArrowLeft className="size-[17px]" />
        Back to room
      </Link>
      <h1 className="mt-5 text-[34px] font-extrabold tracking-[-.03em]">Confirm your stay</h1>

      {/* STEPS */}
      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center gap-[9px]">
          <span className="flex size-[26px] items-center justify-center rounded-full bg-[#7C8CF8] text-[13px] font-bold text-white">
            1
          </span>
          <span className="text-sm font-semibold">Your details</span>
        </div>
        <div className="h-0.5 w-10 bg-[#E7E8EC]" />
        <div className="flex items-center gap-[9px]">
          <span className="flex size-[26px] items-center justify-center rounded-full bg-[#F4F5F7] text-[13px] font-bold text-[#9CA3AF]">
            2
          </span>
          <span className="text-sm font-semibold text-[#9CA3AF]">Payment</span>
        </div>
        <div className="h-0.5 w-10 bg-[#E7E8EC]" />
        <div className="flex items-center gap-[9px]">
          <span className="flex size-[26px] items-center justify-center rounded-full bg-[#F4F5F7] text-[13px] font-bold text-[#9CA3AF]">
            3
          </span>
          <span className="text-sm font-semibold text-[#9CA3AF]">Confirmed</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_380px]">
        {/* FORM */}
        <div
          className="rounded-[22px] border border-[#E7E8EC] bg-white p-[30px]"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <h2 className="text-xl font-bold tracking-[-.02em]">Guest information</h2>
          <div className="mt-[22px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            <Field label="First name" defaultValue="Amara" />
            <Field label="Last name" defaultValue="Okafor" />
            <Field label="Email" defaultValue="amara@email.com" />
            <Field label="Phone" defaultValue="+44 7700 900123" />
          </div>
          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">
              Special requests <span className="font-medium text-[#9CA3AF]">(optional)</span>
            </label>
            <textarea
              placeholder="Late check-in, dietary needs, a special occasion…"
              className="mt-2 min-h-[88px] w-full resize-none rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
            />
          </div>

          <div className="my-[26px] h-px bg-[#F0F1F4]" />
          <h2 className="text-xl font-bold tracking-[-.02em]">Payment method</h2>
          <PaymentMethod />
        </div>

        {/* SUMMARY */}
        <div
          className="sticky top-[92px] rounded-[22px] border border-[#E7E8EC] bg-white p-6"
          style={{ boxShadow: "0 12px 30px rgba(16,24,40,.08)" }}
        >
          <div className="flex gap-3.5">
            <div className="size-[76px] shrink-0 rounded-2xl" style={{ background: room.gradient }} />
            <div>
              <div className="text-base font-bold tracking-[-.01em]">{room.name}</div>
              <div className="mt-[3px] text-[13px] font-medium text-[#9CA3AF]">{room.type}</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Star className="size-[13px] fill-[#F6D68A] text-[#F6D68A]" />
                <span className="text-[12.5px] font-bold">{room.rating}</span>
              </div>
            </div>
          </div>
          <div className="my-5 h-px bg-[#F0F1F4]" />
          <div className="flex flex-col gap-3">
            <SummaryRow label="Dates" value="Jun 12 – 15" />
            <SummaryRow label="Guests" value="2 adults" />
            <SummaryRow label="Nights" value={String(nights)} />
          </div>
          <div className="my-5 h-px bg-[#F0F1F4]" />
          <div className="flex flex-col gap-[11px]">
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>${room.price} &times; {nights} nights</span>
              <span className="font-semibold text-[#1F2937]">${base}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Service fee</span>
              <span className="font-semibold text-[#1F2937]">$48</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-[#6B7280]">
              <span>Taxes</span>
              <span className="font-semibold text-[#1F2937]">${tax}</span>
            </div>
          </div>
          <div className="my-[18px] h-px bg-[#F0F1F4]" />
          <div className="flex items-baseline justify-between">
            <span className="text-[15px] font-bold">Total</span>
            <span className="text-2xl font-extrabold tracking-[-.02em]">${total}</span>
          </div>
          <Link
            href={`/booking/confirm?room=${room.id}`}
            className="btnp mt-5 block w-full rounded-[15px] py-4 text-center text-base font-bold text-white"
            style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
          >
            Confirm booking
          </Link>
          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[13px] font-medium text-[#9CA3AF]">
            <ShieldCheck className="size-3.5" />
            Secured &middot; Free cancellation
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
      />
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="font-medium text-[#6B7280]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
