// The Postgres driver adapter (@prisma/adapter-pg) surfaces constraint
// violations as a DriverAdapterError whose `.cause.code` is the raw Postgres
// SQLSTATE (e.g. "23001" restrict_violation, "23503" foreign_key_violation)
// rather than Prisma's classic wrapped "P2003". Check both shapes so the
// friendly "has existing bookings" errors work regardless of engine mode.
const POSTGRES_FK_CODES = new Set(["23001", "23503"]);

export function isForeignKeyError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const e = err as { code?: string; cause?: { code?: string } };
  if (e.code === "P2003") return true;
  if (e.cause?.code && POSTGRES_FK_CODES.has(e.cause.code)) return true;
  return false;
}
