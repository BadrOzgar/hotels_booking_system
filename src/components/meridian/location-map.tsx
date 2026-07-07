"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

// A minimalist house glyph (matches lucide's "Home" icon) drawn as raw SVG, since Leaflet's
// divIcon only accepts an HTML string — it can't render a React <Icon /> component directly.
const HOUSE_SVG =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg>';

export function LocationMap({
  lat,
  lng,
  label,
  zoom = 15,
}: {
  lat: number;
  lng: number;
  label: string;
  zoom?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    // Leaflet touches `window`/`document` at import time, so it can only ever be loaded
    // client-side — importing it at module scope crashes this component during SSR.
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        className: "",
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
          <div style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9999px;background:#1F2937;box-shadow:0 6px 16px rgba(16,24,40,.35);border:2px solid white;">
            ${HOUSE_SVG}
          </div>
          <div style="width:11px;height:11px;background:#1F2937;transform:rotate(45deg);margin-top:-8px;"></div>
        </div>`,
        iconSize: [38, 48],
        iconAnchor: [19, 48],
      });

      L.marker([lat, lng], { icon }).addTo(map);
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, zoom]);

  return <div ref={containerRef} role="img" aria-label={label} className="size-full" />;
}
