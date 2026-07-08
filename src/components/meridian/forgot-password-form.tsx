"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  requestPasswordResetOtpAction,
  verifyPasswordResetOtpAction,
  resetPasswordAction,
} from "@/app/forgot-password/actions";

type Step = "email" | "otp" | "reset" | "done";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", email);
      const result = await requestPasswordResetOtpAction(undefined, formData);
      if (result) {
        setError(result);
        return;
      }
      setStep("otp");
    } finally {
      setPending(false);
    }
  }

  async function handleVerifyOtp() {
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const valid = await verifyPasswordResetOtpAction(email, code.trim());
      if (!valid) {
        setError("That code is invalid or has expired.");
        return;
      }
      setStep("reset");
    } finally {
      setPending(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("code", code.trim());
      formData.set("password", password);
      const result = await resetPasswordAction(undefined, formData);
      if (result) {
        setError(result);
        return;
      }
      setStep("done");
    } finally {
      setPending(false);
    }
  }

  if (step === "done") {
    return (
      <div className="mt-6">
        <p className="text-[15px] font-semibold text-[#1F2937]">Password updated.</p>
        <p className="mt-2 text-[14px] text-[#6B7280]">Your password has been changed successfully.</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="btnp mt-6 w-full rounded-2xl py-[15px] text-base font-bold text-white"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          Back to sign in
        </button>
      </div>
    );
  }

  if (step === "email") {
    return (
      <form onSubmit={handleRequestOtp}>
        <div className="mt-6">
          <label className="text-[13px] font-semibold text-[#374151]">Email address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
          />
        </div>
        {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="btnp mt-6 w-full rounded-2xl py-[15px] text-base font-bold text-white disabled:opacity-60"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          {pending ? "Sending…" : "Send reset code"}
        </button>
      </form>
    );
  }

  if (step === "otp") {
    return (
      <div>
        <p className="mt-6 text-[14px] text-[#6B7280]">
          If an account exists for <span className="font-semibold text-[#1F2937]">{email}</span>, we&apos;ve
          sent a 6-digit code. It expires in 10 minutes.
        </p>
        <div className="mt-4">
          <label className="text-[13px] font-semibold text-[#374151]">6-digit code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="123456"
            className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-center text-[22px] font-bold tracking-[8px] outline-none"
          />
        </div>
        {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}
        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={pending || code.length !== 6}
          className="btnp mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-[15px] text-base font-bold text-white disabled:opacity-60"
          style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Verifying…" : "Verify code"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("email");
            setCode("");
            setError(null);
          }}
          className="navlink mt-4 w-full text-center text-[13.5px] font-semibold text-[#7C8CF8]"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword}>
      <p className="mt-6 text-[14px] text-[#6B7280]">Choose a new password for your account.</p>
      <div className="mt-4">
        <label className="text-[13px] font-semibold text-[#374151]">New password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-4 py-3.5 text-[15px] outline-none"
        />
      </div>
      {error && <p className="mt-3 text-[13.5px] font-medium text-[#D96A6A]">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btnp mt-6 w-full rounded-2xl py-[15px] text-base font-bold text-white disabled:opacity-60"
        style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
