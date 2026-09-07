"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { serviceAreaConfig } from "@/config/serviceArea";
import { addressFromCoordinates, type DawaAddress } from "@/lib/dawa";

/**
 * KORT TIL AT VÆLGE ADRESSE
 * ------------------------------------------------
 * Kunden klikker på kortet, hvor de bor. Vi finder den nærmeste rigtige
 * adresse og udfylder adressefeltet automatisk.
 *
 * Den blå cirkel viser dit køreområde, så kunden med det samme kan se,
 * om de ligger indenfor. Størrelsen styres af maxDistanceKm i
 * src/config/serviceArea.ts.
 *
 * Kortet hentes først, når kunden åbner det, så forsiden loader hurtigt.
 */
export function AddressMapPicker({
  onPick,
}: {
  onPick: (address: DawaAddress) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "looking-up">("loading");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !containerRef.current || mapRef.current) return;

      const center: [number, number] = [
        serviceAreaConfig.centerLatitude,
        serviceAreaConfig.centerLongitude,
      ];

      const map = L.map(containerRef.current, {
        center,
        zoom: 11,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const areaCircle = L.circle(center, {
        radius: serviceAreaConfig.maxDistanceKm * 1000,
        color: "#14a79a",
        weight: 2,
        fillColor: "#14a79a",
        fillOpacity: 0.12,
      }).addTo(map);

      // Zoom ud, så hele køreområdet lige akkurat kan ses.
      map.fitBounds(areaCircle.getBounds(), { padding: [12, 12] });

      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="width:22px;height:22px;border-radius:50%;background:#0b1220;border:3px solid #33c2b2;box-shadow:0 2px 8px rgba(11,18,32,.4)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      map.on("click", async (event: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = event.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
        }

        setStatus("looking-up");
        setNotFound(false);
        const address = await addressFromCoordinates(lng, lat);
        if (cancelled) return;

        setStatus("ready");
        if (address) {
          onPick(address);
        } else {
          setNotFound(true);
        }
      });

      setStatus("ready");
    }

    setupMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [onPick]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={containerRef}
        className="h-72 w-full overflow-hidden rounded-xl border border-ink/15 bg-paper-muted"
      />
      <p className="text-xs text-ink-soft">
        {status === "loading" && "Henter kort..."}
        {status === "looking-up" && "Finder adressen..."}
        {status === "ready" && !notFound &&
          `Klik på kortet, hvor du bor. Det grønne område er vejledende – den præcise afstand måles på cykelruten (${serviceAreaConfig.maxDistanceKm} km), så steder på den anden side af fjorden tæller vejen rundt.`}
        {notFound && "Kunne ikke finde en adresse der – prøv at klikke tættere på en vej."}
      </p>
    </div>
  );
}
