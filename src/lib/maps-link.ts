/**
 * Extracts coordinates directly from a Google Maps URL — this is the single source of truth for
 * a hotel's pin location (city/country/address are then reverse-geocoded from these coordinates,
 * never typed independently, so they can never drift out of sync with where the pin actually is).
 *
 * Handles both full URLs (coordinates already in the link) and short "maps.app.goo.gl" /
 * "goo.gl/maps" links (which redirect to a full URL server-side — they can't be parsed directly).
 */
export async function resolveGoogleMapsLink(rawUrl: string): Promise<{ lat: number; lng: number } | null> {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  const isShortLink = /goo\.gl$/.test(url.hostname) || url.hostname === "maps.app.goo.gl";
  const resolvedUrl = isShortLink ? await followRedirect(trimmed) : trimmed;
  if (!resolvedUrl) return null;

  return extractCoordinates(resolvedUrl);
}

async function followRedirect(shortUrl: string): Promise<string | null> {
  try {
    const res = await fetch(shortUrl, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": "Meridian-Hotel-Booking/1.0 (map link resolver)" },
      signal: AbortSignal.timeout(8_000),
    });
    return res.url || null;
  } catch {
    return null;
  }
}

function extractCoordinates(url: string): { lat: number; lng: number } | null {
  // Most precise: the actual pinned place, e.g. "...!3d34.020882!4d-6.84165..."
  const placeMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (placeMatch) return { lat: Number(placeMatch[1]), lng: Number(placeMatch[2]) };

  // "q=34.020882,-6.84165" (older share-link style)
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: Number(qMatch[1]), lng: Number(qMatch[2]) };

  // Viewport center, e.g. "/@34.020882,-6.84165,17z" — less precise than a place pin, but the
  // best available fallback when the link only encodes the map view.
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };

  return null;
}
