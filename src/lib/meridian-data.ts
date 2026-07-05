type StatusToken = { c: string; bg: string; bd: string };

// Keyed by the real Prisma enum values (BookingStatus / PaymentStatus / RoomUnitStatus).
export const bookingStatusTokens: Record<string, StatusToken> = {
  CONFIRMED: { c: "#4FB878", bg: "#EDFBF3", bd: "#C9EED8" },
  PENDING: { c: "#D9A441", bg: "#FEF8EA", bd: "#F3E4B8" },
  CHECKED_IN: { c: "#4A5AE0", bg: "#F3F5FF", bd: "#D3DAFB" },
  CHECKED_OUT: { c: "#6B7280", bg: "#F4F5F7", bd: "#E4E6EB" },
  CANCELLED: { c: "#D96A6A", bg: "#FDEEEE", bd: "#F5CFCF" },
};

// Keyed by HotelAccountStatus (PENDING / ACTIVE / SUSPENDED).
export const hotelAccountStatusTokens: Record<string, StatusToken> = {
  ACTIVE: { c: "#4FB878", bg: "#EDFBF3", bd: "#C9EED8" },
  PENDING: { c: "#D9A441", bg: "#FEF8EA", bd: "#F3E4B8" },
  SUSPENDED: { c: "#D96A6A", bg: "#FDEEEE", bd: "#F5CFCF" },
};

export const paymentStatusTokens: Record<string, { c: string; bg: string }> = {
  PAID: { c: "#4FB878", bg: "#EDFBF3" },
  PENDING: { c: "#D9A441", bg: "#FEF8EA" },
  REFUNDED: { c: "#6B7280", bg: "#F4F5F7" },
  FAILED: { c: "#D96A6A", bg: "#FDEEEE" },
};

export const roomStatusTokens: Record<string, StatusToken> = {
  AVAILABLE: { c: "#4FB878", bg: "#EDFBF3", bd: "#C9EED8" },
  OCCUPIED: { c: "#4A5AE0", bg: "#F3F5FF", bd: "#D3DAFB" },
  MAINTENANCE: { c: "#D9A441", bg: "#FEF8EA", bd: "#F3E4B8" },
  HIDDEN: { c: "#6B7280", bg: "#F4F5F7", bd: "#E4E6EB" },
};

/** "CHECKED_IN" -> "Checked in" */
export function formatStatusLabel(status: string): string {
  const words = status.toLowerCase().split("_");
  return words.map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w)).join(" ");
}

/** "5 min ago" / "3 hours ago" / "2 days ago" */
export function formatRelativeTime(date: Date): string {
  const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** "booking.status_changed" -> "Booking status changed" */
export function formatActivityTitle(action: string): string {
  const label = action.split(".").join(" ").replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

const BED_TYPE_LABELS: Record<string, string> = {
  KING: "King",
  QUEEN: "Queen",
  DOUBLE: "Double",
  TWIN: "Twin",
  SOFA: "Sofa",
  BUNK: "Bunk",
};

/** [{bedType:"KING",quantity:1},{bedType:"SOFA",quantity:1}] -> "1 King bed + 1 Sofa bed" */
export function formatBeds(beds: { bedType: string; quantity: number }[]): string {
  if (beds.length === 0) return "Bed configuration on request";
  return beds
    .map((b) => `${b.quantity} ${BED_TYPE_LABELS[b.bedType] ?? b.bedType} bed${b.quantity > 1 ? "s" : ""}`)
    .join(" + ");
}

export const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export type CalendarDay = {
  day: number | "";
  color: string;
  bg: string;
  border: string;
};

/** Decorative placeholder grid for the room-detail "Availability" section (not tied to real bookings). */
export function buildCalendar(): CalendarDay[] {
  const days: CalendarDay[] = [];
  for (let i = 0; i < 35; i++) {
    const shown = i >= 1 && i <= 30 ? i : "";
    const isSel = typeof shown === "number" && shown >= 12 && shown <= 15;
    const unavail =
      shown === 7 || shown === 8 || shown === 22 || shown === 23 || shown === 24;
    days.push({
      day: shown,
      color: shown === "" ? "transparent" : isSel ? "#4A5AE0" : unavail ? "#C7CAD2" : "#374151",
      bg: isSel ? "#EEF1FF" : unavail ? "#F4F5F7" : shown === "" ? "transparent" : "#fff",
      border: isSel ? "1px solid #C9D1FB" : shown === "" ? "none" : "1px solid #EEF0F4",
    });
  }
  return days;
}
