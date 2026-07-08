import {
  MessageCircle,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="fu">
      {/* HERO STRIP */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#7C8CF8 0%,#8FD3FE 60%,#A8E6CF 100%)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(110% 90% at 15% 10%,rgba(255,255,255,.24),transparent 58%)",
          }}
        />
        <div className="relative mx-auto max-w-[1240px] px-4 pt-12 pb-12 sm:px-6 sm:pt-16 sm:pb-16 md:px-8 md:pb-[72px]">
          <div
            className="flex w-fit items-center gap-2 rounded-full px-3.5 py-[7px]"
            style={{
              background: "rgba(255,255,255,.9)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 14px rgba(16,24,40,.1)",
            }}
          >
            <MessageCircle className="size-[15px] text-[#7C8CF8]" />
            <span className="text-[13px] font-semibold text-[#1F2937]">
              We reply within the hour
            </span>
          </div>
          <h1
            className="mt-[22px] text-[clamp(1.8rem,6vw,3.25rem)] leading-[1.08] font-extrabold tracking-[-.035em] text-white sm:leading-[1.02]"
            style={{ textShadow: "0 2px 20px rgba(16,24,40,.2)" }}
          >
            Get in touch
          </h1>
          <p className="mt-4 max-w-[520px] text-[15px] leading-[1.55] text-white/92 sm:text-lg">
            Questions about a stay, an event, or a special request? Our team by the
            sea is here to help — every day, from dawn to dusk.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-10 px-4 pt-14 pb-16 sm:px-6 md:pb-[90px] lg:grid-cols-[1fr_420px] lg:px-8">
        {/* FORM */}
        <div
          className="rounded-[22px] border border-[#E7E8EC] bg-white p-5 sm:p-[34px]"
          style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
        >
          <h2 className="text-[22px] font-bold tracking-[-.02em]">Send us a message</h2>
          <p className="mt-2 text-[14.5px] font-medium text-[#6B7280]">
            Fill in the form and we&apos;ll be right back with you.
          </p>
          <div className="mt-[26px] grid grid-cols-1 gap-[18px] sm:grid-cols-2">
            <Field label="First name" placeholder="Amara" />
            <Field label="Last name" placeholder="Okafor" />
            <Field label="Email" placeholder="you@email.com" />
            <Field label="Phone" placeholder="+1 (650) 000-0000" optional />
          </div>
          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">
              What is this about?
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5 rounded-[10px] border border-[#C9D1FB] bg-[#F3F5FF] px-3.5 py-2 text-[13px] font-semibold text-[#4A5AE0]">
                A reservation
              </span>
              {["Events & weddings", "Dining", "Other"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-[10px] border border-[#E7E8EC] bg-white px-3.5 py-2 text-[13px] font-medium text-[#6B7280]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-[18px]">
            <label className="text-[13px] font-semibold text-[#374151]">Message</label>
            <textarea
              placeholder="Tell us how we can help…"
              className="mt-2 min-h-[120px] w-full resize-none rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
            />
          </div>
          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#9CA3AF]">
              <Lock className="size-3.5" />
              Your details stay private
            </div>
            <button
              type="button"
              className="btnp flex w-full items-center justify-center gap-[9px] rounded-2xl px-7 py-3.5 text-[15px] font-bold text-white sm:w-auto"
              style={{ background: "#7C8CF8", boxShadow: "0 6px 18px rgba(124,140,248,.3)" }}
            >
              Send message <ArrowRight className="size-[17px]" />
            </button>
          </div>
        </div>

        {/* INFO SIDEBAR */}
        <div className="flex flex-col gap-4">
          <InfoCard icon={MapPin} bg="#EFF1FF" fg="#7C8CF8" title="Visit us">
            1 Shoreline Drive
            <br />
            Half Moon Bay, CA 94019
          </InfoCard>
          <InfoCard icon={Phone} bg="#EDFBF3" fg="#4FB878" title="Call or email">
            +1 (650) 555-0142
            <br />
            stay@meridian.co
          </InfoCard>
          <div
            className="rounded-[20px] border border-[#E7E8EC] bg-white p-6"
            style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <div className="flex size-11 items-center justify-center rounded-[13px] bg-[#FFF3EC]">
              <Clock className="size-[21px] text-[#E88A5A]" />
            </div>
            <div className="mt-4 text-[15px] font-bold">Front desk hours</div>
            <div className="mt-3 flex flex-col gap-[7px]">
              <div className="flex justify-between text-[13.5px]">
                <span className="font-medium text-[#6B7280]">Mon &ndash; Fri</span>
                <span className="font-semibold">7:00 &ndash; 22:00</span>
              </div>
              <div className="flex justify-between text-[13.5px]">
                <span className="font-medium text-[#6B7280]">Sat &ndash; Sun</span>
                <span className="font-semibold">6:30 &ndash; 23:00</span>
              </div>
            </div>
          </div>
          <div
            className="relative h-[180px] overflow-hidden rounded-[20px] border border-[#E7E8EC]"
            style={{ background: "linear-gradient(135deg,#A8E6CF,#CFEAFE)", boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(80% 100% at 50% 0%,rgba(255,255,255,.35),transparent 60%)" }}
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
              <MapPin className="size-[34px] fill-white text-[#7C8CF8]" />
            </div>
            <div
              className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 rounded-full bg-white/94 px-[13px] py-[7px] text-[12.5px] font-semibold"
              style={{ backdropFilter: "blur(6px)", boxShadow: "0 2px 8px rgba(16,24,40,.1)" }}
            >
              <Navigation className="size-3.5 text-[#7C8CF8]" />
              Get directions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  optional,
}: {
  label: string;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="text-[13px] font-semibold text-[#374151]">
        {label} {optional && <span className="font-medium text-[#9CA3AF]">(optional)</span>}
      </label>
      <input
        placeholder={placeholder}
        className="mt-2 w-full rounded-[13px] border border-[#E7E8EC] bg-[#FCFCFD] px-[15px] py-3.5 text-[15px] outline-none"
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  bg,
  fg,
  title,
  children,
}: {
  icon: typeof MapPin;
  bg: string;
  fg: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="lift rounded-[20px] border border-[#E7E8EC] bg-white p-6"
      style={{ boxShadow: "0 1px 2px rgba(16,24,40,.04)" }}
    >
      <div className="flex size-11 items-center justify-center rounded-[13px]" style={{ background: bg }}>
        <Icon className="size-[21px]" style={{ color: fg }} />
      </div>
      <div className="mt-4 text-[15px] font-bold">{title}</div>
      <div className="mt-1.5 text-sm leading-[1.55] font-medium text-[#6B7280]">{children}</div>
    </div>
  );
}
