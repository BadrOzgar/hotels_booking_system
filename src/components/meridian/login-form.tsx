"use client";

import { useActionState } from "react";
import { Eye, Check } from "lucide-react";
import { authenticate } from "@/app/login/actions";

export function LoginForm() {
  const [error, action, pending] = useActionState(authenticate, undefined);

  return (
    <form action={action}>
      <div className="mt-6 rounded-xl border border-[#E7E8EC] bg-[#FAFAFB] px-3.5 py-2.5 text-[12.5px] font-medium text-[#9CA3AF]">
        Demo mode — credentials are pre-filled, just hit sign in.
      </div>
      <div className="mt-5">
        <label className="text-[13px] font-semibold text-[#374151]">Email address</label>
        <input
          name="email"
          type="email"
          defaultValue="demo@meridian.co"
          required
          className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
        />
      </div>
      <div className="mt-[18px]">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-[#374151]">Password</label>
          <span className="navlink text-[13px] font-semibold text-[#7C8CF8]">
            Forgot password?
          </span>
        </div>
        <div className="relative mt-2">
          <input
            name="password"
            type="password"
            defaultValue="demo1234"
            required
            className="w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
          />
          <Eye className="absolute top-1/2 right-4 size-[18px] -translate-y-1/2 text-[#9CA3AF]" />
        </div>
      </div>

      {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}

      <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm font-medium text-[#6B7280]">
        <span className="flex size-[18px] items-center justify-center rounded-md" style={{ background: "#7C8CF8", border: "2px solid #7C8CF8" }}>
          <Check className="size-3 text-white" />
        </span>
        Remember me for 30 days
      </label>

      <button
        type="submit"
        disabled={pending}
        className="btnp mt-6 w-full rounded-2xl py-[15px] text-base font-bold text-white disabled:opacity-60"
        style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
