export type Room = {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  price: number;
  cap: number;
  size: number;
  beds: string;
  bath: number;
  rating: number;
  reviews: number;
  tag: string;
  gradient: string;
  amenities: string[];
  description: string;
};

export const rooms: Room[] = [
  {
    id: "tide",
    hotelId: "meridian-half-moon-bay",
    name: "Tide Suite",
    type: "Suite",
    price: 420,
    cap: 2,
    size: 48,
    beds: "1 King bed",
    bath: 1,
    rating: 4.9,
    reviews: 214,
    tag: "Guest favorite",
    gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
    amenities: ["Ocean view", "Balcony", "Free WiFi", "Rain shower", "Nespresso", "Smart TV"],
    description:
      "A serene corner suite framed by floor-to-ceiling glass, opening onto a private balcony above the shoreline. Wake to the sound of the tide and light that moves across the room all day.",
  },
  {
    id: "dune",
    hotelId: "meridian-aspen",
    name: "Dune Loft",
    type: "Deluxe Loft",
    price: 310,
    cap: 3,
    size: 55,
    beds: "1 King + sofa bed",
    bath: 1,
    rating: 4.8,
    reviews: 167,
    tag: "",
    gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
    amenities: ["Garden view", "Kitchenette", "Free WiFi", "Bathtub", "Workspace", "Smart TV"],
    description:
      "A split-level loft with a sun-warmed palette, generous kitchenette and a mezzanine that makes it ideal for longer coastal stays.",
  },
  {
    id: "coral",
    hotelId: "meridian-half-moon-bay",
    name: "Coral Room",
    type: "Garden Double",
    price: 190,
    cap: 2,
    size: 32,
    beds: "2 Queen beds",
    bath: 1,
    rating: 4.7,
    reviews: 302,
    tag: "",
    gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
    amenities: ["Garden view", "Free WiFi", "Rain shower", "Nespresso", "Smart TV"],
    description:
      "Bright and uncomplicated, opening onto the herb garden. A calm base for exploring the bay, steps from the pool.",
  },
  {
    id: "marea",
    hotelId: "meridian-half-moon-bay",
    name: "Marea Villa",
    type: "Beachfront Villa",
    price: 780,
    cap: 4,
    size: 92,
    beds: "2 King beds",
    bath: 2,
    rating: 5.0,
    reviews: 88,
    tag: "Beachfront",
    gradient: "linear-gradient(135deg,#7C8CF8,#A8E6CF)",
    amenities: ["Beachfront", "Private terrace", "Free WiFi", "Soaking tub", "Kitchen", "Butler service"],
    description:
      "Our signature villa sits directly on the sand with a wraparound terrace and plunge pool — a private retreat for families or two couples travelling together.",
  },
  {
    id: "azure",
    hotelId: "meridian-lisbon",
    name: "Azure Studio",
    type: "Studio",
    price: 160,
    cap: 2,
    size: 28,
    beds: "1 Queen bed",
    bath: 1,
    rating: 4.6,
    reviews: 341,
    tag: "",
    gradient: "linear-gradient(135deg,#CFEAFE,#8FD3FE)",
    amenities: ["City view", "Free WiFi", "Rain shower", "Workspace", "Smart TV"],
    description:
      "An efficient, light-filled studio with everything considered. Perfect for a solo traveller or a short weekend by the water.",
  },
  {
    id: "horizon",
    hotelId: "meridian-aspen",
    name: "Horizon Penthouse",
    type: "Penthouse",
    price: 1200,
    cap: 6,
    size: 140,
    beds: "3 King beds",
    bath: 3,
    rating: 5.0,
    reviews: 42,
    tag: "Signature",
    gradient: "linear-gradient(135deg,#F7D9C4,#7C8CF8)",
    amenities: ["Panoramic view", "Rooftop terrace", "Free WiFi", "Sauna", "Full kitchen", "Butler service"],
    description:
      "The top floor, entirely yours. Wraparound terraces, a private rooftop and uninterrupted horizon in every direction.",
  },
];

export function getRoom(id: string) {
  return rooms.find((r) => r.id === id);
}

export type Hotel = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  tag: string;
  gradient: string;
  description: string;
};

export const hotels: Hotel[] = [
  {
    id: "meridian-half-moon-bay",
    name: "Meridian Coastal Resort",
    location: "Half Moon Bay, California",
    rating: 4.9,
    reviews: 612,
    priceFrom: 160,
    tag: "Beachfront",
    gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
    description:
      "Our flagship coastal retreat, with rooms opening onto the shoreline and an unhurried pace all through the day.",
  },
  {
    id: "meridian-aspen",
    name: "Meridian Alpine Lodge",
    location: "Aspen, Colorado",
    rating: 4.8,
    reviews: 341,
    priceFrom: 240,
    tag: "Mountain",
    gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
    description:
      "A timber-framed lodge at the foot of the slopes, with fireside lounges and rooms warmed by mountain light.",
  },
  {
    id: "meridian-lisbon",
    name: "Meridian Harbor House",
    location: "Lisbon, Portugal",
    rating: 4.9,
    reviews: 258,
    priceFrom: 190,
    tag: "Historic",
    gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
    description:
      "A restored harborside townhouse in Alfama, pairing original tilework with quiet, modern rooms above the water.",
  },
];

export function getHotel(id: string) {
  return hotels.find((h) => h.id === id);
}

export function getHotelRooms(hotelId: string) {
  return rooms.filter((r) => r.hotelId === hotelId);
}

export function roomPricing(price: number, nights = 3) {
  const base = price * nights;
  const tax = Math.round(base * 0.12);
  const serviceFee = 48;
  const total = base + serviceFee + tax;
  return { base, tax, serviceFee, total, nights };
}

export const amenities = [
  { icon: "waves", label: "Ocean pool", bg: "#EAF6FF", fg: "#3FA9F5" },
  { icon: "utensils", label: "Restaurant", bg: "#FFF3EC", fg: "#E88A5A" },
  { icon: "flower", label: "Coastal spa", bg: "#EDFBF3", fg: "#4FB878" },
  { icon: "dumbbell", label: "Fitness", bg: "#EFF1FF", fg: "#7C8CF8" },
  { icon: "wifi", label: "Fast WiFi", bg: "#EAF6FF", fg: "#3FA9F5" },
  { icon: "parking", label: "Parking", bg: "#FBF4EA", fg: "#D9A441" },
] as const;

export const testimonials = [
  {
    quote:
      "The quietest, most restorative week we have had in years. The balcony over the water is worth every cent — we did not want to leave.",
    name: "Amara Okafor",
    place: "London, UK",
    gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)",
  },
  {
    quote:
      "Booking took two minutes and everything was exactly as shown. Front desk had our room ready early with a note and fresh coffee.",
    name: "Daniel Reyes",
    place: "Austin, TX",
    gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)",
  },
  {
    quote:
      "Design-lovers, this is your place. Every detail considered, nothing overdone. The spa and the sunset from the pool are unreal.",
    name: "Sofie Lind",
    place: "Copenhagen, DK",
    gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)",
  },
];

export const faqs = [
  {
    q: "What time is check-in and check-out?",
    a: "Check-in is from 3:00 PM and check-out is until 11:00 AM. Early arrival and late departure can be arranged based on availability.",
  },
  {
    q: "Is breakfast included?",
    a: "Yes — every direct booking includes our coastal breakfast, served on the terrace from 7:00 to 10:30 AM.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Free cancellation up to 48 hours before arrival. After that, the first night is charged.",
  },
  {
    q: "Do you allow pets?",
    a: "Well-behaved dogs are welcome in our Garden and Loft rooms for a small nightly fee. Please let us know in advance.",
  },
];

type StatusToken = { c: string; bg: string; bd: string };

export const bookingStatusTokens: Record<string, StatusToken> = {
  Confirmed: { c: "#4FB878", bg: "#EDFBF3", bd: "#C9EED8" },
  Pending: { c: "#D9A441", bg: "#FEF8EA", bd: "#F3E4B8" },
  "Checked in": { c: "#4A5AE0", bg: "#F3F5FF", bd: "#D3DAFB" },
  "Checked out": { c: "#6B7280", bg: "#F4F5F7", bd: "#E4E6EB" },
  Cancelled: { c: "#D96A6A", bg: "#FDEEEE", bd: "#F5CFCF" },
};

export const paymentStatusTokens: Record<string, { c: string; bg: string }> = {
  Paid: { c: "#4FB878", bg: "#EDFBF3" },
  Pending: { c: "#D9A441", bg: "#FEF8EA" },
  Refunded: { c: "#6B7280", bg: "#F4F5F7" },
};

export type AdminBooking = {
  id: string;
  guest: string;
  initials: string;
  room: string;
  num: string;
  cin: string;
  cout: string;
  guests: number;
  status: keyof typeof bookingStatusTokens;
  payment: keyof typeof paymentStatusTokens;
  gradient: string;
};

export const adminBookings: AdminBooking[] = [
  { id: "MRD-4821", guest: "Amara Okafor", initials: "AO", room: "Tide Suite", num: "204", cin: "Jun 12", cout: "Jun 15", guests: 2, status: "Confirmed", payment: "Paid", gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)" },
  { id: "MRD-4820", guest: "Daniel Reyes", initials: "DR", room: "Dune Loft", num: "112", cin: "Jun 11", cout: "Jun 14", guests: 3, status: "Checked in", payment: "Paid", gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)" },
  { id: "MRD-4819", guest: "Sofie Lind", initials: "SL", room: "Marea Villa", num: "V-2", cin: "Jun 10", cout: "Jun 17", guests: 4, status: "Checked in", payment: "Paid", gradient: "linear-gradient(135deg,#7C8CF8,#A8E6CF)" },
  { id: "MRD-4818", guest: "James Whitfield", initials: "JW", room: "Coral Room", num: "108", cin: "Jun 13", cout: "Jun 15", guests: 2, status: "Pending", payment: "Pending", gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)" },
  { id: "MRD-4817", guest: "Mei Tanaka", initials: "MT", room: "Azure Studio", num: "301", cin: "Jun 09", cout: "Jun 11", guests: 1, status: "Checked out", payment: "Paid", gradient: "linear-gradient(135deg,#CFEAFE,#8FD3FE)" },
  { id: "MRD-4816", guest: "Lucas Moreau", initials: "LM", room: "Horizon Penthouse", num: "PH", cin: "Jun 14", cout: "Jun 20", guests: 5, status: "Confirmed", payment: "Paid", gradient: "linear-gradient(135deg,#F7D9C4,#7C8CF8)" },
  { id: "MRD-4815", guest: "Nadia Hassan", initials: "NH", room: "Coral Room", num: "109", cin: "Jun 08", cout: "Jun 10", guests: 2, status: "Cancelled", payment: "Refunded", gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)" },
  { id: "MRD-4814", guest: "Priya Sharma", initials: "PS", room: "Coral Room", num: "110", cin: "Jun 12", cout: "Jun 16", guests: 2, status: "Confirmed", payment: "Paid", gradient: "linear-gradient(135deg,#CFEAFE,#7C8CF8)" },
  { id: "MRD-4813", guest: "Marcus Webb", initials: "MW", room: "Azure Studio", num: "302", cin: "Jun 12", cout: "Jun 13", guests: 1, status: "Pending", payment: "Pending", gradient: "linear-gradient(135deg,#F7D9C4,#A8E6CF)" },
  { id: "MRD-4812", guest: "Ines Duarte", initials: "ID", room: "Dune Loft", num: "113", cin: "Jun 12", cout: "Jun 19", guests: 2, status: "Confirmed", payment: "Paid", gradient: "linear-gradient(135deg,#8FD3FE,#A8E6CF)" },
];

export function getAdminBooking(id: string) {
  return adminBookings.find((b) => b.id === id);
}

export const roomStatusTokens: Record<string, StatusToken> = {
  Available: { c: "#4FB878", bg: "#EDFBF3", bd: "#C9EED8" },
  Occupied: { c: "#4A5AE0", bg: "#F3F5FF", bd: "#D3DAFB" },
  Maintenance: { c: "#D9A441", bg: "#FEF8EA", bd: "#F3E4B8" },
  Hidden: { c: "#6B7280", bg: "#F4F5F7", bd: "#E4E6EB" },
};

export type RoomRow = {
  name: string;
  type: string;
  number: string;
  price: number;
  cap: number;
  status: keyof typeof roomStatusTokens;
  gradient: string;
};

export const roomRows: RoomRow[] = [
  { name: "Tide Suite", type: "Suite", number: "204", price: 420, cap: 2, status: "Occupied", gradient: "linear-gradient(135deg,#8FD3FE,#7C8CF8)" },
  { name: "Dune Loft", type: "Deluxe Loft", number: "112", price: 310, cap: 3, status: "Available", gradient: "linear-gradient(135deg,#F7D9C4,#F6E6CF)" },
  { name: "Coral Room", type: "Garden Double", number: "108", price: 190, cap: 2, status: "Available", gradient: "linear-gradient(135deg,#A8E6CF,#CFEAFE)" },
  { name: "Marea Villa", type: "Beachfront Villa", number: "V-2", price: 780, cap: 4, status: "Occupied", gradient: "linear-gradient(135deg,#7C8CF8,#A8E6CF)" },
  { name: "Azure Studio", type: "Studio", number: "301", price: 160, cap: 2, status: "Maintenance", gradient: "linear-gradient(135deg,#CFEAFE,#8FD3FE)" },
  { name: "Horizon Penthouse", type: "Penthouse", number: "PH", price: 1200, cap: 6, status: "Hidden", gradient: "linear-gradient(135deg,#F7D9C4,#7C8CF8)" },
];

export function getRoomRow(number: string) {
  return roomRows.find((r) => r.number === number);
}

export const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export type CalendarDay = {
  day: number | "";
  color: string;
  bg: string;
  border: string;
};

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

export const revenueBars = [
  { label: "Mon", h: "52%", fill: "#DFE3FB" },
  { label: "Tue", h: "68%", fill: "#DFE3FB" },
  { label: "Wed", h: "46%", fill: "#DFE3FB" },
  { label: "Thu", h: "88%", fill: "linear-gradient(180deg,#7C8CF8,#8FD3FE)" },
  { label: "Fri", h: "74%", fill: "#DFE3FB" },
  { label: "Sat", h: "96%", fill: "#DFE3FB" },
  { label: "Sun", h: "62%", fill: "#DFE3FB" },
];
