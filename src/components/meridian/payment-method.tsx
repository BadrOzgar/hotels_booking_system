"use client";

import { useState } from "react";
import { CreditCard, Wallet, Building2 } from "lucide-react";

type Method = "card" | "hotel";

export function PaymentMethod() {
  const [method, setMethod] = useState<Method>("card");

  return (
    <div>
      <div className="mt-[18px] flex gap-3">
        <button
          type="button"
          onClick={() => setMethod("card")}
          className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-2xl border-2 p-4 text-left"
          style={
            method === "card"
              ? { borderColor: "#7C8CF8", background: "#F3F5FF" }
              : { borderColor: "#E7E8EC", background: "transparent" }
          }
        >
          <CreditCard className={`size-5 ${method === "card" ? "text-[#7C8CF8]" : "text-[#9CA3AF]"}`} />
          <span
            className="text-[14.5px] font-semibold"
            style={{ color: method === "card" ? "#1F2937" : "#6B7280" }}
          >
            Card
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMethod("hotel")}
          className="flex flex-1 cursor-pointer items-center gap-2.5 rounded-2xl border-2 p-4 text-left"
          style={
            method === "hotel"
              ? { borderColor: "#7C8CF8", background: "#F3F5FF" }
              : { borderColor: "#E7E8EC", background: "transparent" }
          }
        >
          <Wallet className={`size-5 ${method === "hotel" ? "text-[#7C8CF8]" : "text-[#9CA3AF]"}`} />
          <span
            className="text-[14.5px] font-semibold"
            style={{ color: method === "hotel" ? "#1F2937" : "#6B7280" }}
          >
            Pay at hotel
          </span>
        </button>
      </div>

      <input type="hidden" name="paymentMethod" value={method === "card" ? "CARD" : "PAY_AT_HOTEL"} />

      {method === "card" ? (
        <>
          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">Card number</label>
            <div className="relative mt-2">
              <input
                name="cardNumber"
                defaultValue="4242 4242 4242 4242"
                className="w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
              />
              <CreditCard className="absolute top-1/2 right-[15px] size-[18px] -translate-y-1/2 text-[#9CA3AF]" />
            </div>
          </div>
          <div className="mt-[18px] grid grid-cols-2 gap-[18px]">
            <Field label="Expiry" defaultValue="09 / 28" />
            <Field label="CVC" defaultValue="•••" />
          </div>
        </>
      ) : (
        <div className="mt-[18px] flex items-start gap-3 rounded-2xl border border-[#E7E8EC] bg-[#FAFAFB] p-4">
          <Building2 className="size-5 shrink-0 text-[#7C8CF8]" />
          <div>
            <div className="text-[14.5px] font-semibold text-[#1F2937]">
              Settle your bill on arrival
            </div>
            <div className="mt-1 text-[13.5px] leading-[1.5] text-[#6B7280]">
              No card details needed now. Bring a valid card or cash to the front desk at
              check-in to cover your stay.
            </div>
          </div>
        </div>
      )}
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
