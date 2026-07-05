import { prisma } from "@/lib/prisma";

export type RevenueBar = { label: string; h: string; fill: string };
export type RevenueSeries = {
  bars: RevenueBar[];
  total: string;
  deltaLabel: string;
};

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
function addDays(d: Date, n: number) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

function bucketize(bookings: { checkIn: Date; totalAmount: unknown }[], buckets: { start: Date; end: Date; label: string }[]) {
  return buckets.map(({ start, end, label }) => {
    const value = bookings
      .filter((b) => b.checkIn >= start && b.checkIn <= end)
      .reduce((sum, b) => sum + Number(b.totalAmount), 0);
    return { label, value };
  });
}

function toBars(values: { label: string; value: number }[]): RevenueBar[] {
  const max = Math.max(...values.map((v) => v.value), 1);
  return values.map((v) => ({
    label: v.label,
    h: `${Math.max(8, Math.round((v.value / max) * 100))}%`,
    fill: "linear-gradient(180deg,#8FD3FE,#7C8CF8)",
  }));
}

/** Real revenue series computed from bookings (attributed by check-in date), replacing the old illustrative mock chart. */
export async function getRevenueSeries(
  hotelId: string,
  range: "7D" | "30D" | "1Y",
  today: Date
): Promise<RevenueSeries> {
  const rangeDays = range === "7D" ? 7 : range === "30D" ? 30 : 365;
  const periodStart = startOfDay(addDays(today, -(rangeDays - 1)));
  const periodEnd = endOfDay(today);
  const priorStart = startOfDay(addDays(periodStart, -rangeDays));
  const priorEnd = endOfDay(addDays(periodStart, -1));

  const [currentBookings, priorAgg] = await Promise.all([
    prisma.booking.findMany({
      where: { hotelId, status: { not: "CANCELLED" }, checkIn: { gte: periodStart, lte: periodEnd } },
      select: { checkIn: true, totalAmount: true },
    }),
    prisma.booking.aggregate({
      where: { hotelId, status: { not: "CANCELLED" }, checkIn: { gte: priorStart, lte: priorEnd } },
      _sum: { totalAmount: true },
    }),
  ]);

  const total = currentBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const priorTotal = Number(priorAgg._sum.totalAmount ?? 0);
  const deltaLabel =
    priorTotal > 0
      ? `${total >= priorTotal ? "↑" : "↓"} ${Math.round((Math.abs(total - priorTotal) / priorTotal) * 100)}%`
      : total > 0
        ? "↑ new"
        : "— 0%";

  let buckets: { start: Date; end: Date; label: string }[];
  if (range === "7D") {
    buckets = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(periodStart, i);
      return { start: startOfDay(day), end: endOfDay(day), label: WEEKDAY_LABELS[day.getDay()] };
    });
  } else if (range === "30D") {
    buckets = Array.from({ length: 5 }, (_, i) => {
      const start = addDays(periodStart, i * 6);
      const end = i === 4 ? periodEnd : endOfDay(addDays(start, 5));
      return { start, end, label: `W${i + 1}` };
    });
  } else {
    buckets = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
      const start = startOfDay(monthDate);
      const end = endOfDay(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0));
      return { start, end, label: MONTH_LABELS[monthDate.getMonth()] };
    });
  }

  const bucketValues = bucketize(currentBookings, buckets);

  return {
    bars: toBars(bucketValues),
    total: `${Math.round(total).toLocaleString("en-US")} MAD`,
    deltaLabel,
  };
}
