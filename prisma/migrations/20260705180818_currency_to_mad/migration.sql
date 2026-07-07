-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "currency" SET DEFAULT 'MAD';

-- AlterTable
ALTER TABLE "hotels" ALTER COLUMN "currency" SET DEFAULT 'MAD';

-- AlterTable
ALTER TABLE "invoices" ALTER COLUMN "currency" SET DEFAULT 'MAD';

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'MAD';

-- Backfill existing rows still set to the old default so the platform is consistently MAD.
UPDATE "bookings" SET "currency" = 'MAD' WHERE "currency" = 'USD';
UPDATE "hotels" SET "currency" = 'MAD' WHERE "currency" = 'USD';
UPDATE "invoices" SET "currency" = 'MAD' WHERE "currency" = 'USD';
UPDATE "payments" SET "currency" = 'MAD' WHERE "currency" = 'USD';
