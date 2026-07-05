/** Formats an amount as Moroccan Dirham, e.g. `formatCurrency(1234.5)` -> "1,234.50 MAD". */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const formatted =
    rounded % 1 === 0
      ? rounded.toLocaleString("en-US")
      : rounded.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${formatted} MAD`;
}

export type PriceBreakdown = {
  nights: number;
  base: number;
  serviceFee: number;
  tax: number;
  total: number;
};

/**
 * Computes the guest-facing price breakdown for a stay.
 * `taxRatePercent` is a percentage (e.g. 12 for 12%), `serviceFeeCents` is a flat fee in cents.
 */
export function computePricing({
  pricePerNight,
  nights,
  serviceFeeCents,
  taxRatePercent,
}: {
  pricePerNight: number;
  nights: number;
  serviceFeeCents: number;
  taxRatePercent: number;
}): PriceBreakdown {
  const base = pricePerNight * nights;
  const serviceFee = serviceFeeCents / 100;
  const tax = Math.round(base * (taxRatePercent / 100));
  const total = base + serviceFee + tax;
  return { nights, base, serviceFee, tax, total };
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

/** Generates a short, human-friendly booking reference like "MHB-7231". */
export function generateConfirmationCode(hotelCode: string): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${hotelCode}-${suffix}`;
}
