-- CreateEnum
CREATE TYPE "HotelAccountStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('TRIAL', 'BASIC', 'PRO');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "SystemRole_new" AS ENUM ('SUPER_ADMIN', 'HOTEL_OWNER');
ALTER TABLE "public"."users" ALTER COLUMN "systemRole" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "systemRole" TYPE "SystemRole_new" USING ("systemRole"::text::"SystemRole_new");
ALTER TYPE "SystemRole" RENAME TO "SystemRole_old";
ALTER TYPE "SystemRole_new" RENAME TO "SystemRole";
DROP TYPE "public"."SystemRole_old";
ALTER TABLE "users" ALTER COLUMN "systemRole" SET DEFAULT 'HOTEL_OWNER';
COMMIT;

-- DropForeignKey
ALTER TABLE "booking_promotions" DROP CONSTRAINT "booking_promotions_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "booking_promotions" DROP CONSTRAINT "booking_promotions_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "hotels" DROP CONSTRAINT "hotels_groupId_fkey";

-- DropForeignKey
ALTER TABLE "promotion_hotels" DROP CONSTRAINT "promotion_hotels_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "promotion_hotels" DROP CONSTRAINT "promotion_hotels_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- DropForeignKey
ALTER TABLE "staff_assignments" DROP CONSTRAINT "staff_assignments_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "staff_assignments" DROP CONSTRAINT "staff_assignments_roleId_fkey";

-- DropForeignKey
ALTER TABLE "staff_assignments" DROP CONSTRAINT "staff_assignments_userId_fkey";

-- DropIndex
DROP INDEX "guests_email_key";

-- DropIndex
DROP INDEX "hotels_groupId_idx";

-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "hotels" DROP COLUMN "groupId",
DROP COLUMN "isActive",
ADD COLUMN     "accountStatus" "HotelAccountStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ALTER COLUMN "systemRole" SET DEFAULT 'HOTEL_OWNER';

-- DropTable
DROP TABLE "booking_promotions";

-- DropTable
DROP TABLE "hotel_groups";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "promotion_hotels";

-- DropTable
DROP TABLE "promotions";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "staff_assignments";

-- DropEnum
DROP TYPE "PromotionType";

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'TRIAL',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "hotelId" TEXT,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_hotelId_key" ON "subscriptions"("hotelId");

-- CreateIndex
CREATE INDEX "activity_logs_hotelId_idx" ON "activity_logs"("hotelId");

-- CreateIndex
CREATE INDEX "activity_logs_userId_idx" ON "activity_logs"("userId");

-- CreateIndex
CREATE INDEX "guests_hotelId_idx" ON "guests"("hotelId");

-- CreateIndex
CREATE UNIQUE INDEX "guests_hotelId_email_key" ON "guests"("hotelId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "hotels_ownerId_key" ON "hotels"("ownerId");

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
