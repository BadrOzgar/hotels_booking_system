import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SUPER_ADMIN_EMAIL = "platform@meridian.co";
const SUPER_ADMIN_PASSWORD = "platform12345";

const OWNER_EMAIL = "admin@meridian.co";
const OWNER_PASSWORD = "admin12345";
const OWNER_NAME = "Hotel Admin";

const HOTEL_CODE = "MRD";
const HOTEL_NAME = "My Hotel";

const AMENITY_CATALOG: { key: string; label: string; icon: string }[] = [
  { key: "ocean_pool", label: "Ocean pool", icon: "waves" },
  { key: "restaurant", label: "Restaurant", icon: "utensils" },
  { key: "coastal_spa", label: "Coastal spa", icon: "flower" },
  { key: "fitness", label: "Fitness", icon: "dumbbell" },
  { key: "fast_wifi", label: "Fast WiFi", icon: "wifi" },
  { key: "parking", label: "Parking", icon: "parking" },
  { key: "ocean_view", label: "Ocean view", icon: "waves" },
  { key: "balcony", label: "Balcony", icon: "door-open" },
  { key: "free_wifi", label: "Free WiFi", icon: "wifi" },
  { key: "rain_shower", label: "Rain shower", icon: "shower-head" },
  { key: "nespresso", label: "Nespresso", icon: "coffee" },
  { key: "smart_tv", label: "Smart TV", icon: "tv" },
  { key: "garden_view", label: "Garden view", icon: "flower" },
  { key: "kitchenette", label: "Kitchenette", icon: "utensils" },
  { key: "bathtub", label: "Bathtub", icon: "bath" },
  { key: "workspace", label: "Workspace", icon: "briefcase" },
  { key: "beachfront", label: "Beachfront", icon: "waves" },
  { key: "private_terrace", label: "Private terrace", icon: "door-open" },
  { key: "soaking_tub", label: "Soaking tub", icon: "bath" },
  { key: "kitchen", label: "Kitchen", icon: "utensils" },
  { key: "butler_service", label: "Butler service", icon: "bell" },
  { key: "city_view", label: "City view", icon: "building" },
  { key: "panoramic_view", label: "Panoramic view", icon: "mountain" },
  { key: "rooftop_terrace", label: "Rooftop terrace", icon: "door-open" },
  { key: "sauna", label: "Sauna", icon: "flame" },
  { key: "full_kitchen", label: "Full kitchen", icon: "utensils" },
];

const FAQS = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early arrival and late departure can be arranged based on availability.",
  },
  {
    question: "Is breakfast included?",
    answer: "This depends on the property and rate booked — check the room details for what's included.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "Free cancellation up to 48 hours before arrival. After that, the first night is charged.",
  },
];

async function main() {
  console.log("Seeding super admin…");
  const superAdminPasswordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);
  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    update: { password: superAdminPasswordHash, systemRole: "SUPER_ADMIN" },
    create: {
      email: SUPER_ADMIN_EMAIL,
      name: "Platform Admin",
      password: superAdminPasswordHash,
      systemRole: "SUPER_ADMIN",
    },
  });

  console.log("Seeding hotel owner…");
  const ownerPasswordHash = await bcrypt.hash(OWNER_PASSWORD, 12);
  const owner = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: { password: ownerPasswordHash, systemRole: "HOTEL_OWNER", name: OWNER_NAME },
    create: {
      email: OWNER_EMAIL,
      name: OWNER_NAME,
      password: ownerPasswordHash,
      systemRole: "HOTEL_OWNER",
    },
  });

  console.log("Seeding amenity catalog…");
  for (const a of AMENITY_CATALOG) {
    await prisma.amenity.upsert({
      where: { key: a.key },
      update: { label: a.label, icon: a.icon },
      create: a,
    });
  }

  console.log("Seeding empty hotel shell…");
  const hotel = await prisma.hotel.upsert({
    where: { code: HOTEL_CODE },
    update: { ownerId: owner.id },
    create: {
      ownerId: owner.id,
      code: HOTEL_CODE,
      name: HOTEL_NAME,
      description: "Add a description of your property in My Hotel settings.",
      city: "",
      country: "",
      address: "",
      serviceFeeCents: 4800,
      taxRatePercent: 12,
      accountStatus: "ACTIVE",
    },
  });

  await prisma.cancellationPolicy.upsert({
    where: { hotelId: hotel.id },
    update: {},
    create: {
      hotelId: hotel.id,
      freeCancellationHours: 48,
      penaltyNights: 1,
      description: "Free cancellation up to 48 hours before arrival. After that, the first night is charged.",
    },
  });

  await prisma.subscription.upsert({
    where: { hotelId: hotel.id },
    update: {},
    create: {
      hotelId: hotel.id,
      plan: "TRIAL",
      status: "TRIALING",
      currentPeriodEnd: new Date(Date.now() + 30 * 86_400_000),
      trialEndsAt: new Date(Date.now() + 14 * 86_400_000),
    },
  });

  console.log("Seeding faqs…");
  for (const [i, f] of FAQS.entries()) {
    const existing = await prisma.faq.findFirst({ where: { hotelId: null, question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: { hotelId: null, question: f.question, answer: f.answer, sortOrder: i } });
    }
  }

  console.log("Seed complete.");
  console.log(`Super admin login: ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Hotel owner login: ${OWNER_EMAIL} / ${OWNER_PASSWORD}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
