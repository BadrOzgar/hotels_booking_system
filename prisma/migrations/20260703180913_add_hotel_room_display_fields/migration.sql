-- AlterTable
ALTER TABLE "hotels" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "gradient" TEXT NOT NULL DEFAULT 'linear-gradient(135deg,#8FD3FE,#7C8CF8)',
ADD COLUMN     "tag" TEXT;

-- AlterTable
ALTER TABLE "room_types" ADD COLUMN     "gradient" TEXT NOT NULL DEFAULT 'linear-gradient(135deg,#8FD3FE,#7C8CF8)';
