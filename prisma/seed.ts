import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const OWNER_PASSWORD = "admin12345";
const SUPER_ADMIN_EMAIL = "platform@meridian.co";
const SUPER_ADMIN_PASSWORD = "platform12345";

/** Computes a date `offsetDays` from today (at seed-run time) so booking data always reads as current. */
function offsetDate(offsetDays: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
}

type SeedRoomType = {
  key: string;
  name: string;
  type: string;
  price: number;
  cap: number;
  size: number;
  bath: number;
  gradient: string;
  beds: { bedType: "KING" | "QUEEN" | "SOFA"; quantity: number }[];
  amenities: string[];
  description: string;
  units: { number: string; status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "HIDDEN" }[];
};

type SeedHotel = {
  key: string;
  code: string;
  name: string;
  city: string;
  country: string;
  address: string;
  tag: string;
  gradient: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  owner: { email: string; name: string };
  accountStatus: "PENDING" | "ACTIVE" | "SUSPENDED";
  subscription: { plan: "TRIAL" | "BASIC" | "PRO"; status: "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED" };
  roomTypes: SeedRoomType[];
};

const HOTELS: SeedHotel[] = [
  {
    key: "half-moon-bay",
    code: "MHB",
    name: "Meridian Coastal Resort",
    city: "Half Moon Bay",
    country: "United States",
    address: "1 Shoreline Drive, Half Moon Bay, CA 94019",
    tag: "Beachfront",
    gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
    description:
      "Our flagship coastal retreat, with rooms opening onto the shoreline and an unhurried pace all through the day.",
    contactEmail: "stay@meridian.co",
    contactPhone: "+1 (650) 555-0142",
    owner: { email: "admin@meridian.co", name: "Elena Marceau" },
    accountStatus: "ACTIVE",
    subscription: { plan: "PRO", status: "ACTIVE" },
    roomTypes: [
      {
        key: "tide-suite",
        name: "Tide Suite",
        type: "Suite",
        price: 420,
        cap: 2,
        size: 48,
        bath: 1,
        gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
        beds: [{ bedType: "KING", quantity: 1 }],
        amenities: ["Ocean view", "Balcony", "Free WiFi", "Rain shower", "Nespresso", "Smart TV"],
        description:
          "A serene corner suite framed by floor-to-ceiling glass, opening onto a private balcony above the shoreline. Wake to the sound of the tide and light that moves across the room all day.",
        units: [{ number: "204", status: "OCCUPIED" }],
      },
      {
        key: "coral-room",
        name: "Coral Room",
        type: "Garden Double",
        price: 190,
        cap: 2,
        size: 32,
        bath: 1,
        gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
        beds: [{ bedType: "QUEEN", quantity: 2 }],
        amenities: ["Garden view", "Free WiFi", "Rain shower", "Nespresso", "Smart TV"],
        description:
          "Bright and uncomplicated, opening onto the herb garden. A calm base for exploring the bay, steps from the pool.",
        units: [
          { number: "108", status: "AVAILABLE" },
          { number: "109", status: "AVAILABLE" },
          { number: "110", status: "AVAILABLE" },
        ],
      },
      {
        key: "marea-villa",
        name: "Marea Villa",
        type: "Beachfront Villa",
        price: 780,
        cap: 4,
        size: 92,
        bath: 2,
        gradient: "linear-gradient(135deg,#7C8CF8,#A8E6CF)",
        beds: [{ bedType: "KING", quantity: 2 }],
        amenities: ["Beachfront", "Private terrace", "Free WiFi", "Soaking tub", "Kitchen", "Butler service"],
        description:
          "Our signature villa sits directly on the sand with a wraparound terrace and plunge pool — a private retreat for families or two couples travelling together.",
        units: [{ number: "V-2", status: "OCCUPIED" }],
      },
    ],
  },
  {
    key: "aspen",
    code: "ASP",
    name: "Meridian Alpine Lodge",
    city: "Aspen",
    country: "United States",
    address: "88 Summit Road, Aspen, CO 81611",
    tag: "Mountain",
    gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
    description:
      "A timber-framed lodge at the foot of the slopes, with fireside lounges and rooms warmed by mountain light.",
    contactEmail: "stay.aspen@meridian.co",
    contactPhone: "+1 (970) 555-0118",
    owner: { email: "owner.aspen@meridian.co", name: "Marcus Alden" },
    accountStatus: "ACTIVE",
    subscription: { plan: "BASIC", status: "ACTIVE" },
    roomTypes: [
      {
        key: "dune-loft",
        name: "Dune Loft",
        type: "Deluxe Loft",
        price: 310,
        cap: 3,
        size: 55,
        bath: 1,
        gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
        beds: [
          { bedType: "KING", quantity: 1 },
          { bedType: "SOFA", quantity: 1 },
        ],
        amenities: ["Garden view", "Kitchenette", "Free WiFi", "Bathtub", "Workspace", "Smart TV"],
        description:
          "A split-level loft with a sun-warmed palette, generous kitchenette and a mezzanine that makes it ideal for longer coastal stays.",
        units: [
          { number: "112", status: "AVAILABLE" },
          { number: "113", status: "AVAILABLE" },
        ],
      },
      {
        key: "horizon-penthouse",
        name: "Horizon Penthouse",
        type: "Penthouse",
        price: 1200,
        cap: 6,
        size: 140,
        bath: 3,
        gradient: "linear-gradient(135deg,#F7D9C4,#7C8CF8)",
        beds: [{ bedType: "KING", quantity: 3 }],
        amenities: ["Panoramic view", "Rooftop terrace", "Free WiFi", "Sauna", "Full kitchen", "Butler service"],
        description:
          "The top floor, entirely yours. Wraparound terraces, a private rooftop and uninterrupted horizon in every direction.",
        units: [{ number: "PH", status: "HIDDEN" }],
      },
    ],
  },
  {
    key: "lisbon",
    code: "LIS",
    name: "Meridian Harbor House",
    city: "Lisbon",
    country: "Portugal",
    address: "12 Rua do Alfama, 1100-032 Lisbon",
    tag: "Historic",
    gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
    description:
      "A restored harborside townhouse in Alfama, pairing original tilework with quiet, modern rooms above the water.",
    contactEmail: "stay.lisbon@meridian.co",
    contactPhone: "+351 21 555 0187",
    owner: { email: "owner.lisbon@meridian.co", name: "Ines Cardoso" },
    accountStatus: "PENDING",
    subscription: { plan: "BASIC", status: "TRIALING" },
    roomTypes: [
      {
        key: "azure-studio",
        name: "Azure Studio",
        type: "Studio",
        price: 160,
        cap: 2,
        size: 28,
        bath: 1,
        gradient: "linear-gradient(135deg,#CFEAFE,#8FD3FE)",
        beds: [{ bedType: "QUEEN", quantity: 1 }],
        amenities: ["City view", "Free WiFi", "Rain shower", "Workspace", "Smart TV"],
        description:
          "An efficient, light-filled studio with everything considered. Perfect for a solo traveller or a short weekend by the water.",
        units: [
          { number: "301", status: "MAINTENANCE" },
          { number: "302", status: "AVAILABLE" },
        ],
      },
    ],
  },
];

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

const HOTEL_LEVEL_AMENITY_KEYS = [
  "ocean_pool",
  "restaurant",
  "coastal_spa",
  "fitness",
  "fast_wifi",
  "parking",
];

const FAQS = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early arrival and late departure can be arranged based on availability.",
  },
  {
    question: "Is breakfast included?",
    answer: "Yes — every direct booking includes our coastal breakfast, served on the terrace from 7:00 to 10:30 AM.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "Free cancellation up to 48 hours before arrival. After that, the first night is charged.",
  },
  {
    question: "Do you allow pets?",
    answer:
      "Well-behaved dogs are welcome in our Garden and Loft rooms for a small nightly fee. Please let us know in advance.",
  },
];

type SeedBooking = {
  confirmationCode: string;
  guestFirst: string;
  guestLast: string;
  gradient: string;
  roomTypeKey: string;
  unitNumber: string;
  checkInOffset: number; // days relative to today, at seed-run time
  checkOutOffset: number;
  guests: number;
  status: "CONFIRMED" | "PENDING" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  paymentStatus: "PAID" | "PENDING" | "REFUNDED";
  isFeaturedReview?: { rating: number; comment: string };
};

const BOOKINGS: SeedBooking[] = [
  {
    confirmationCode: "MRD-4821",
    guestFirst: "Amara",
    guestLast: "Okafor",
    gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
    roomTypeKey: "tide-suite",
    unitNumber: "204",
    checkInOffset: 0,
    checkOutOffset: 3,
    guests: 2,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    isFeaturedReview: {
      rating: 5,
      comment:
        "The quietest, most restorative week we have had in years. The balcony over the water is worth every cent — we did not want to leave.",
    },
  },
  {
    confirmationCode: "MRD-4820",
    guestFirst: "Daniel",
    guestLast: "Reyes",
    gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
    roomTypeKey: "dune-loft",
    unitNumber: "112",
    checkInOffset: -1,
    checkOutOffset: 2,
    guests: 3,
    status: "CHECKED_IN",
    paymentStatus: "PAID",
    isFeaturedReview: {
      rating: 5,
      comment:
        "Booking took two minutes and everything was exactly as shown. Front desk had our room ready early with a note and fresh coffee.",
    },
  },
  {
    confirmationCode: "MRD-4819",
    guestFirst: "Sofie",
    guestLast: "Lind",
    gradient: "linear-gradient(135deg,#7C8CF8,#A8E6CF)",
    roomTypeKey: "marea-villa",
    unitNumber: "V-2",
    checkInOffset: -2,
    checkOutOffset: 5,
    guests: 4,
    status: "CHECKED_IN",
    paymentStatus: "PAID",
    isFeaturedReview: {
      rating: 5,
      comment:
        "Design-lovers, this is your place. Every detail considered, nothing overdone. The spa and the sunset from the pool are unreal.",
    },
  },
  {
    confirmationCode: "MRD-4818",
    guestFirst: "James",
    guestLast: "Whitfield",
    gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
    roomTypeKey: "coral-room",
    unitNumber: "108",
    checkInOffset: 1,
    checkOutOffset: 3,
    guests: 2,
    status: "PENDING",
    paymentStatus: "PENDING",
  },
  {
    confirmationCode: "MRD-4817",
    guestFirst: "Mei",
    guestLast: "Tanaka",
    gradient: "linear-gradient(135deg,#CFEAFE,#8FD3FE)",
    roomTypeKey: "azure-studio",
    unitNumber: "301",
    checkInOffset: -3,
    checkOutOffset: -1,
    guests: 1,
    status: "CHECKED_OUT",
    paymentStatus: "PAID",
  },
  {
    confirmationCode: "MRD-4816",
    guestFirst: "Lucas",
    guestLast: "Moreau",
    gradient: "linear-gradient(135deg,#F7D9C4,#7C8CF8)",
    roomTypeKey: "horizon-penthouse",
    unitNumber: "PH",
    checkInOffset: 2,
    checkOutOffset: 8,
    guests: 5,
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    confirmationCode: "MRD-4815",
    guestFirst: "Nadia",
    guestLast: "Hassan",
    gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
    roomTypeKey: "coral-room",
    unitNumber: "109",
    checkInOffset: -4,
    checkOutOffset: -2,
    guests: 2,
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
  },
  {
    confirmationCode: "MRD-4814",
    guestFirst: "Priya",
    guestLast: "Sharma",
    gradient: "linear-gradient(135deg,#CFEAFE,#7C8CF8)",
    roomTypeKey: "coral-room",
    unitNumber: "110",
    checkInOffset: 0,
    checkOutOffset: 4,
    guests: 2,
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
  {
    confirmationCode: "MRD-4813",
    guestFirst: "Marcus",
    guestLast: "Webb",
    gradient: "linear-gradient(135deg,#F7D9C4,#A8E6CF)",
    roomTypeKey: "azure-studio",
    unitNumber: "302",
    checkInOffset: 0,
    checkOutOffset: 1,
    guests: 1,
    status: "PENDING",
    paymentStatus: "PENDING",
  },
  {
    confirmationCode: "MRD-4812",
    guestFirst: "Ines",
    guestLast: "Duarte",
    gradient: "linear-gradient(135deg,#8FD3FE,#A8E6CF)",
    roomTypeKey: "dune-loft",
    unitNumber: "113",
    checkInOffset: 0,
    checkOutOffset: 7,
    guests: 2,
    status: "CONFIRMED",
    paymentStatus: "PAID",
  },
];

function slugEmail(first: string, last: string) {
  return `${first.toLowerCase()}.${last.toLowerCase()}@example.com`;
}

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

  console.log("Seeding hotel owners…");
  const ownerPasswordHash = await bcrypt.hash(OWNER_PASSWORD, 12);
  const ownerIdByHotelKey = new Map<string, string>();
  for (const h of HOTELS) {
    const owner = await prisma.user.upsert({
      where: { email: h.owner.email },
      update: { password: ownerPasswordHash, systemRole: "HOTEL_OWNER", name: h.owner.name },
      create: {
        email: h.owner.email,
        name: h.owner.name,
        password: ownerPasswordHash,
        systemRole: "HOTEL_OWNER",
      },
    });
    ownerIdByHotelKey.set(h.key, owner.id);
  }

  console.log("Seeding amenity catalog…");
  const amenityByKey = new Map<string, string>();
  for (const a of AMENITY_CATALOG) {
    const row = await prisma.amenity.upsert({
      where: { key: a.key },
      update: { label: a.label, icon: a.icon },
      create: a,
    });
    amenityByKey.set(a.key, row.id);
  }

  function amenityKeyForLabel(label: string) {
    const found = AMENITY_CATALOG.find((a) => a.label === label);
    if (!found) throw new Error(`No amenity catalog entry for label "${label}"`);
    return found.key;
  }

  console.log("Seeding hotels, room types, and room units…");
  const roomTypeIdByKey = new Map<string, string>();
  const unitIdByNumber = new Map<string, string>();

  for (const h of HOTELS) {
    const ownerId = ownerIdByHotelKey.get(h.key)!;
    const hotel = await prisma.hotel.upsert({
      where: { code: h.code },
      update: {
        ownerId,
        name: h.name,
        description: h.description,
        city: h.city,
        country: h.country,
        address: h.address,
        tag: h.tag,
        gradient: h.gradient,
        contactEmail: h.contactEmail,
        contactPhone: h.contactPhone,
        serviceFeeCents: 4800,
        taxRatePercent: 12,
        accountStatus: h.accountStatus,
      },
      create: {
        ownerId,
        code: h.code,
        name: h.name,
        description: h.description,
        city: h.city,
        country: h.country,
        address: h.address,
        tag: h.tag,
        gradient: h.gradient,
        contactEmail: h.contactEmail,
        contactPhone: h.contactPhone,
        serviceFeeCents: 4800,
        taxRatePercent: 12,
        accountStatus: h.accountStatus,
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
      update: { plan: h.subscription.plan, status: h.subscription.status },
      create: {
        hotelId: hotel.id,
        plan: h.subscription.plan,
        status: h.subscription.status,
        currentPeriodEnd: new Date(Date.now() + 30 * 86_400_000),
        trialEndsAt: h.subscription.status === "TRIALING" ? new Date(Date.now() + 14 * 86_400_000) : null,
      },
    });

    for (const amenityKey of HOTEL_LEVEL_AMENITY_KEYS) {
      await prisma.hotelAmenity.upsert({
        where: { hotelId_amenityId: { hotelId: hotel.id, amenityId: amenityByKey.get(amenityKey)! } },
        update: {},
        create: { hotelId: hotel.id, amenityId: amenityByKey.get(amenityKey)! },
      });
    }

    for (const rt of h.roomTypes) {
      const existing = await prisma.roomType.findFirst({
        where: { hotelId: hotel.id, name: rt.name },
      });
      const roomType = existing
        ? await prisma.roomType.update({
            where: { id: existing.id },
            data: {
              category: rt.type,
              description: rt.description,
              basePricePerNight: rt.price,
              capacity: rt.cap,
              sizeSqm: rt.size,
              bathrooms: rt.bath,
              gradient: rt.gradient,
            },
          })
        : await prisma.roomType.create({
            data: {
              hotelId: hotel.id,
              name: rt.name,
              category: rt.type,
              description: rt.description,
              basePricePerNight: rt.price,
              capacity: rt.cap,
              sizeSqm: rt.size,
              bathrooms: rt.bath,
              gradient: rt.gradient,
            },
          });
      roomTypeIdByKey.set(rt.key, roomType.id);

      for (const bed of rt.beds) {
        await prisma.roomTypeBed.upsert({
          where: { roomTypeId_bedType: { roomTypeId: roomType.id, bedType: bed.bedType } },
          update: { quantity: bed.quantity },
          create: { roomTypeId: roomType.id, bedType: bed.bedType, quantity: bed.quantity },
        });
      }

      for (const label of rt.amenities) {
        const amenityId = amenityByKey.get(amenityKeyForLabel(label))!;
        await prisma.roomTypeAmenity.upsert({
          where: { roomTypeId_amenityId: { roomTypeId: roomType.id, amenityId } },
          update: {},
          create: { roomTypeId: roomType.id, amenityId },
        });
      }

      for (const unit of rt.units) {
        const roomUnit = await prisma.roomUnit.upsert({
          where: { hotelId_unitNumber: { hotelId: hotel.id, unitNumber: unit.number } },
          update: { status: unit.status, roomTypeId: roomType.id },
          create: {
            hotelId: hotel.id,
            roomTypeId: roomType.id,
            unitNumber: unit.number,
            status: unit.status,
          },
        });
        unitIdByNumber.set(unit.number, roomUnit.id);
      }
    }
  }

  console.log("Seeding faqs…");
  for (const [i, f] of FAQS.entries()) {
    const existing = await prisma.faq.findFirst({ where: { hotelId: null, question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: { hotelId: null, question: f.question, answer: f.answer, sortOrder: i } });
    }
  }

  console.log("Seeding guests and bookings…");
  for (const b of BOOKINGS) {
    const roomTypeId = roomTypeIdByKey.get(b.roomTypeKey);
    const roomUnitId = unitIdByNumber.get(b.unitNumber);
    if (!roomTypeId || !roomUnitId) throw new Error(`Missing room mapping for booking ${b.confirmationCode}`);

    const roomType = await prisma.roomType.findUniqueOrThrow({ where: { id: roomTypeId } });

    const email = slugEmail(b.guestFirst, b.guestLast);
    const guest = await prisma.guest.upsert({
      where: { hotelId_email: { hotelId: roomType.hotelId, email } },
      update: { firstName: b.guestFirst, lastName: b.guestLast },
      create: { hotelId: roomType.hotelId, firstName: b.guestFirst, lastName: b.guestLast, email },
    });
    const checkIn = offsetDate(b.checkInOffset, 15, 0);
    const checkOut = offsetDate(b.checkOutOffset, 11, 0);
    const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000);
    const base = Number(roomType.basePricePerNight) * nights;
    const serviceFee = 48;
    const tax = Math.round(base * 0.12);
    const total = base + serviceFee + tax;

    const booking = await prisma.booking.upsert({
      where: { confirmationCode: b.confirmationCode },
      update: {
        status: b.status,
        checkIn,
        checkOut,
        nights,
        baseAmount: base,
        serviceFeeAmount: serviceFee,
        taxAmount: tax,
        totalAmount: total,
      },
      create: {
        confirmationCode: b.confirmationCode,
        hotelId: roomType.hotelId,
        roomTypeId,
        roomUnitId,
        guestId: guest.id,
        contactFirstName: b.guestFirst,
        contactLastName: b.guestLast,
        contactEmail: email,
        contactPhone: "+1 (555) 010-0100",
        checkIn,
        checkOut,
        nights,
        adults: b.guests,
        status: b.status,
        baseAmount: base,
        serviceFeeAmount: serviceFee,
        taxAmount: tax,
        totalAmount: total,
        statusHistory: {
          create: { toStatus: b.status, note: "Seeded" },
        },
        payments: {
          create: {
            method: b.paymentStatus === "PENDING" ? "PAY_AT_HOTEL" : "CARD",
            status: b.paymentStatus,
            amount: total,
            cardLast4: b.paymentStatus === "PENDING" ? null : "4242",
            paidAt: b.paymentStatus === "PAID" ? checkIn : null,
          },
        },
        invoice: {
          create: {
            invoiceNumber: `INV-${b.confirmationCode}`,
            status: b.status === "CANCELLED" ? "VOID" : "ISSUED",
            issuedAt: checkIn,
            totalAmount: total,
            lineItems: {
              create: [
                { label: `${roomType.name} × ${nights} nights`, unitAmount: roomType.basePricePerNight, quantity: nights, amount: base, sortOrder: 0 },
                { label: "Service fee", unitAmount: serviceFee, amount: serviceFee, sortOrder: 1 },
                { label: "Taxes", unitAmount: tax, amount: tax, sortOrder: 2 },
              ],
            },
          },
        },
      },
    });

    if (b.isFeaturedReview) {
      await prisma.review.upsert({
        where: { bookingId: booking.id },
        update: {},
        create: {
          bookingId: booking.id,
          hotelId: booking.hotelId,
          roomTypeId,
          rating: b.isFeaturedReview.rating,
          comment: b.isFeaturedReview.comment,
          isFeatured: true,
        },
      });
    }
  }

  console.log("Seed complete.");
  console.log(`Super admin login: ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_PASSWORD}`);
  for (const h of HOTELS) {
    console.log(`Hotel owner login (${h.name}): ${h.owner.email} / ${OWNER_PASSWORD}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
