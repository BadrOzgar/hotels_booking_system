import { Building2, PhoneCall } from "lucide-react";

/** Guest checkout only supports pay-at-hotel — no card details are collected online. */
export function PayAtHotelNotice() {
  return (
    <div>
      <input type="hidden" name="paymentMethod" value="PAY_AT_HOTEL" />

      <div className="mt-[18px] flex items-start gap-3 rounded-2xl border border-[#E7E8EC] bg-[#FAFAFB] p-4">
        <Building2 className="size-5 shrink-0 text-[#7C8CF8]" />
        <div>
          <div className="text-[14.5px] font-semibold text-[#1F2937]">Settle your bill on arrival</div>
          <div className="mt-1 text-[13.5px] leading-normal text-[#6B7280]">
            No card details needed now. Bring a valid card or cash to the front desk at check-in to cover
            your stay.
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#F3E4B8] bg-[#FEF8EA] p-4">
        <PhoneCall className="size-5 shrink-0 text-[#D9A441]" />
        <div>
          <div className="text-[14.5px] font-semibold text-[#8A6416]">The hotel will call to confirm</div>
          <div className="mt-1 text-[13.5px] leading-normal text-[#8A6416]">
            After you submit, someone from the hotel will reach out by phone to confirm your reservation
            and answer any questions before your stay.
          </div>
        </div>
      </div>
    </div>
  );
}
