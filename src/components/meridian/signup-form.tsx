"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/signup/actions";

export function SignupForm() {
  const [error, action, pending] = useActionState(signupAction, undefined);

  return (
    <form action={action}>
      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">
        Your details
      </h2>
      <div className="mt-3 grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <Field label="Full name" name="ownerName" placeholder="Amara Okafor" />
        <Field label="Email" name="email" type="email" placeholder="you@hotel.com" />
      </div>
      <div className="mt-[14px]">
        <Field label="Password" name="password" type="password" placeholder="At least 8 characters" />
      </div>

      <h2 className="mt-6 text-[13px] font-bold tracking-[.04em] text-[#9CA3AF] uppercase">
        Your hotel
      </h2>
      <div className="mt-3 flex flex-col gap-[14px]">
        <Field label="Hotel name" name="hotelName" placeholder="Cliffside Inn" />
        <div className="grid grid-cols-2 gap-[14px]">
          <Field label="City" name="city" placeholder="Big Sur" />
          <Field label="Country" name="country" placeholder="United States" />
        </div>
        <Field label="Address" name="address" placeholder="1 Cliff Road" />
      </div>

      {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btnp mt-6 w-full rounded-2xl py-[15px] text-base font-bold text-white disabled:opacity-60"
        style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
      >
        {pending ? "Creating your workspace…" : "Create my hotel workspace"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        minLength={type === "password" ? 8 : undefined}
        className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
      />
    </div>
  );
}
