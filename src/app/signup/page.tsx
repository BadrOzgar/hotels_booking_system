import Link from "next/link";
import Image from "next/image";
import { Star, ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/meridian/signup-form";

export default function SignupPage() {
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
          <div>
            <div className="flex gap-[3px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-[18px] fill-white text-white" />
              ))}
            </div>
            <p className="mt-5 max-w-[440px] text-[26px] leading-[1.4] font-bold text-white tracking-[-.02em]">
              &ldquo;List your hotel in minutes, not weeks. Meridian gave us a real booking
              engine on day one.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="size-11 rounded-full border-2 border-white/50 bg-white/28" />
              <div>
                <div className="text-[15px] font-bold text-white">New on Meridian</div>
                <div className="text-[13.5px] text-white/82">Your hotel, live today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="relative flex flex-col justify-center px-8 py-12 sm:px-14 lg:px-[72px]">
        <Link
          href="/"
          className="navlink absolute top-9 right-8 inline-flex items-center gap-[7px] text-sm font-semibold text-[#6B7280] sm:right-14"
        >
          <ArrowLeft className="size-4" />
          Back to website
        </Link>
        <div className="mx-auto w-full max-w-[440px]">
          <h1 className="text-[32px] font-extrabold tracking-[-.03em]">List your hotel</h1>
          <p className="mt-3 text-[15.5px] text-[#6B7280]">
            Create your Meridian workspace — one account, one hotel, ready to take bookings.
          </p>

          <SignupForm />

          <p className="mt-6 text-center text-[13.5px] font-medium text-[#9CA3AF]">
            Already have a workspace?{" "}
            <Link href="/login" className="navlink font-semibold text-[#7C8CF8]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
