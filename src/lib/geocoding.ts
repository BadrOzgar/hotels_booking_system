/**
 * Turns coordinates into a city/country/display address using OpenStreetMap's Nominatim reverse
 * API — free, no API key/billing required. Used so a hotel's location is always derived from the
 * exact map pin (via a pasted Google Maps link) rather than independently typed text that can
 * drift out of sync with where the pin actually is.
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string; country: string; address: string } | null> {
  try {
    // accept-language=en keeps city/country names in a single, consistent script — Morocco (and
    // similar multi-script locales) otherwise returns "Meknès ⴰⵎⴽⵏⴰⵙ مكناس"-style combined names.
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Meridian-Hotel-Booking/1.0 (hotel location lookup)" },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      display_name?: string;
      address?: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
        state?: string;
        country?: string;
        road?: string;
        house_number?: string;
        suburb?: string;
        neighbourhood?: string;
      };
    };
    const a = data.address;
    if (!a) return null;

    const city = a.city || a.town || a.village || a.municipality || a.county || a.state || "";
    const country = a.country || "";
    const address =
      [a.house_number, a.road].filter(Boolean).join(" ") ||
      a.suburb ||
      a.neighbourhood ||
      data.display_name ||
      "";

    if (!city || !country) return null;
    return { city, country, address };
  } catch {
    return null;
  }
}
