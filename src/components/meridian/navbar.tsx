import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";

export async function Navbar() {
  const session = await auth();

  const isAuthenticated = session?.user.systemRole === "SUPER_ADMIN" || session?.user.systemRole === "HOTEL_OWNER";
  let authLink = { href: "/signup", label: "Create Account" };
  if (session?.user.systemRole === "SUPER_ADMIN") {
    authLink = { href: "/super-admin", label: "Dashboard" };
  } else if (session?.user.systemRole === "HOTEL_OWNER") {
    authLink = { href: "/admin", label: "My hotel" };
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "rgba(250,250,248,.82)",
        backdropFilter: "blur(14px)",
        borderColor: "#ECEDF1",
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="Meridian"
            width={34}
            height={34}
            className="rounded-[11px]"
            style={{ boxShadow: "0 4px 12px rgba(124,140,248,.3)" }}
          />
          <span className="text-[19px] font-bold tracking-[-.02em] text-[#1F2937]">
            Meridian
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="navlink text-[14.5px] font-medium text-[#1F2937]">
            Home
          </Link>
          <Link href="/hotels" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            Hotels
          </Link>
          <Link href="/rooms" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            Rooms
          </Link>
          <Link href="/about" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            About
          </Link>
          <Link href="/contact" className="navlink text-[14.5px] font-medium text-[#6B7280]">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-3.5">
          {isAuthenticated ? (
            <Link
              href={authLink.href}
              className="btnp rounded-[13px] px-5 py-[11px] text-[14.5px] font-semibold text-white"
              style={{
                background: "#7C8CF8",
                boxShadow: "0 4px 14px rgba(124,140,248,.28)",
              }}
            >
              {authLink.label}
            </Link>
          ) : (
            <>
              <Link href={authLink.href} className="navlink text-[14.5px] font-semibold text-[#6B7280]">
                {authLink.label}
              </Link>
              <Link
                href="/rooms"
                className="btnp rounded-[13px] px-5 py-[11px] text-[14.5px] font-semibold text-white"
                style={{
                  background: "#7C8CF8",
                  boxShadow: "0 4px 14px rgba(124,140,248,.28)",
                }}
              >
                Book now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
