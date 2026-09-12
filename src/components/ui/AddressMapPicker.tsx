"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import { serviceAreaConfig } from "@/config/serviceArea";
import { addressFromCoordinates, type DawaAddress } from "@/lib/dawa";
import { fetchCyclingReachArea } from "@/lib/serviceAreaShape";

/**
 * KORT TIL AT VÆLGE ADRESSE
 * ------------------------------------------------
 * Kunden klikker på kortet, hvor de bor. Vi finder den nærmeste rigtige
 * adresse og udfylder adressefeltet automatisk.
 *
 * Det grønne område viser, hvor langt man faktisk kan komme på cykel
 * inden for maxDistanceKm (src/config/serviceArea.ts) – altså med veje,
 * broer og fjorden regnet med, ikke bare en cirkel.
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
  const [lookupFailed, setLookupFailed] = useState(false);
  const [isAreaExact, setIsAreaExact] = useState(false);

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

      const areaStyle = {
        color: "#0e8a80",
        weight: 3,
        fillColor: "#14a79a",
        fillOpacity: 0.3,
      };

      // Vis det område, man faktisk kan nå på cykel. Kan det ikke hentes,
      // falder vi tilbage til en cirkel (mindre præcis, men bedre end intet).
      const reachArea = await fetchCyclingReachArea();
      if (cancelled) return;

      const areaLayer = reachArea
        ? L.geoJSON(reachArea, { style: () => areaStyle }).addTo(map)
        : L.circle(center, {
            ...areaStyle,
            radius: serviceAreaConfig.maxDistanceKm * 1000,
          }).addTo(map);

      setIsAreaExact(reachArea !== null);

      L.circleMarker(center, {
        radius: 6,
        color: "#ffffff",
        weight: 2,
        fillColor: "#0b1220",
        fillOpacity: 1,
      })
        .addTo(map)
        .bindTooltip("FreshInside kører ud herfra");

      // Zoom, så hele køreområdet lige akkurat kan ses.
      map.fitBounds(areaLayer.getBounds(), { padding: [12, 12] });

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
        setLookupFailed(false);

        let address: DawaAddress | null = null;
        let failed = false;
        try {
          address = await addressFromCoordinates(lng, lat);
        } catch {
          failed = true;
        }
        if (cancelled) return;

        setStatus("ready");
        setLookupFailed(failed);
        if (address) {
          onPick(address);
        } else if (!failed) {
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
        className="h-96 w-full overflow-hidden rounded-xl border border-ink/15 bg-paper-muted"
      />
      <p className="text-xs text-ink-soft">
        {status === "loading" && "Henter kort..."}
        {status === "looking-up" && "Finder adressen..."}
        {status === "ready" && !notFound && !lookupFailed && (
          isAreaExact
            ? `Klik på kortet, hvor du bor. Det grønne område er præcis så langt, der cykles ud (${serviceAreaConfig.maxDistanceKm} km ad vejen).`
            : `Klik på kortet, hvor du bor. Det grønne område er vejledende – den præcise afstand måles på cykelruten (${serviceAreaConfig.maxDistanceKm} km).`
        )}
        {notFound && "Kunne ikke finde en adresse der – prøv at klikke tættere på en vej."}
        {lookupFailed &&
          "Adresseopslaget svarer ikke lige nu. Luk kortet og skriv din adresse i feltet i stedet."}
      </p>
    </div>
  );
}
