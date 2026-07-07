import Link from "next/link";
import Image from "next/image";
import { Star, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/meridian/login-form";
import { continueWithGmail } from "@/app/login/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const suspendedMessage =
    error === "AccountSuspended"
      ? "Your account has been suspended. Please contact our support team to check your account status."
      : null;

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
              &ldquo;Managing the property has never felt this calm. Meridian&apos;s dashboard
              is the first hotel software our whole team actually enjoys using.&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="size-11 rounded-full border-2 border-white/50 bg-white/28" />
              <div>
                <div className="text-[15px] font-bold text-white">Elena Marceau</div>
                <div className="text-[13.5px] text-white/82">General Manager &middot; Meridian</div>
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
        <div className="mx-auto w-full max-w-[400px]">
          <h1 className="text-[32px] font-extrabold tracking-[-.03em]">Welcome back</h1>
          <p className="mt-3 text-[15.5px] text-[#6B7280]">
            Sign in to your Meridian admin workspace.
          </p>

          {suspendedMessage && (
            <p className="mt-4 rounded-xl border border-[#F5CFCF] bg-[#FDEEEE] px-4 py-3 text-[13.5px] font-medium text-[#D96A6A]">
              {suspendedMessage}
            </p>
          )}

          <LoginForm />

          <div className="my-6 flex items-center gap-3.5">
            <div className="h-px flex-1 bg-[#EEEFF2]" />
            <span className="text-[13px] font-medium text-[#9CA3AF]">or</span>
            <div className="h-px flex-1 bg-[#EEEFF2]" />
          </div>
          <form action={continueWithGmail}>
            <button
              type="submit"
              className="btns flex w-full items-center justify-center gap-2.5 rounded-2xl border border-[#E7E8EC] bg-white py-3.5 text-[15px] font-semibold text-[#1F2937]"
            >
              <GoogleIcon className="size-[18px]" />
              Continue with Gmail
            </button>
          </form>

          <p className="mt-6 text-center text-[13.5px] font-medium text-[#9CA3AF]">
            New to Meridian?{" "}
            <Link href="/signup" className="navlink font-semibold text-[#7C8CF8]">
              List your hotel
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3c-1.08.72-2.46 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.998 11.998 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.998 11.998 0 0 0 0 12c0 1.94.46 3.77 1.27 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.87 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
