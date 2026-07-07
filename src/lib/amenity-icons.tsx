import {
  Waves,
  UtensilsCrossed,
  Flower2,
  Dumbbell,
  Wifi,
  CircleParking,
  DoorOpen,
  ShowerHead,
  Coffee,
  Tv,
  Bath,
  Briefcase,
  Building2,
  Mountain,
  Flame,
  Bell,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const AMENITY_ICON_MAP: Record<string, LucideIcon> = {
  waves: Waves,
  utensils: UtensilsCrossed,
  flower: Flower2,
  dumbbell: Dumbbell,
  wifi: Wifi,
  parking: CircleParking,
  "door-open": DoorOpen,
  "shower-head": ShowerHead,
  coffee: Coffee,
  tv: Tv,
  bath: Bath,
  briefcase: Briefcase,
  building: Building2,
  mountain: Mountain,
  flame: Flame,
  bell: Bell,
};

/** Falls back to a generic sparkle icon for amenities without a recognized (or any) icon key. */
export function amenityIcon(icon: string | null | undefined): LucideIcon {
  return (icon && AMENITY_ICON_MAP[icon]) || Sparkles;
}
