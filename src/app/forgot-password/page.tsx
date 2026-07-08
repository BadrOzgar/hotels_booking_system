import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "@/components/meridian/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
      {/* LEFT IMAGE */}
      <div
        className="relative hidden overflow-hidden lg:block"
        style={{ background: "linear-gradient(150deg,#7C8CF8 0%,#8FD3FE 55%,#A8E6CF 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(110% 80% at 20% 15%,rgba(255,255,255,.26),transparent 55%)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg,rgba(16,24,40,0),rgba(16,24,40,.28))" }}
        />
        <div className="relative flex h-full flex-col justify-between px-14 py-12">
          <Link href="/" className="flex items-center gap-[11px]">
            <Image src="/logo.png" alt="Meridian" width={36} height={36} className="rounded-[11px]" />
            <span className="text-xl font-bold text-white">Meridian</span>
          </Link>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="relative flex flex-col justify-center px-8 py-12 sm:px-14 lg:px-[72px]">
        <Link
          href="/login"
          className="navlink absolute top-9 right-8 inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280] sm:right-14"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
        <div className="mx-auto w-full max-w-[400px]">
          <h1 className="text-[32px] font-extrabold tracking-[-.03em]">Reset your password</h1>
          <p className="mt-3 text-[15.5px] text-[#6B7280]">
            Enter your account email and we&apos;ll send you a code to reset your password.
          </p>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
