import { serviceAreaConfig } from "@/config/serviceArea";

/**
 * OMRÅDETS FACON PÅ KORTET
 * ------------------------------------------------
 * I stedet for en cirkel (som er misvisende, fordi man ikke kan cykle
 * tværs over Limfjorden) henter vi det område, man rent faktisk kan nå
 * inden for maxDistanceKm på cykel.
 *
 * Området beregnes af Valhalla – en gratis, offentlig rutetjeneste
 * bygget på OpenStreetMap. Ingen konto eller nøgle nødvendig.
 */

const VALHALLA_ISOCHRONE_URL = "https://valhalla1.openstreetmap.de/isochrone";
const TIMEOUT_MS = 15000;

/** GeoJSON-omrids af det område, der kan nås på cykel. Null hvis det ikke kunne hentes. */
export async function fetchCyclingReachArea(): Promise<GeoJSON.FeatureCollection | null> {
  const body = {
    locations: [
      {
        lat: serviceAreaConfig.centerLatitude,
        lon: serviceAreaConfig.centerLongitude,
      },
    ],
    costing: serviceAreaConfig.routingProfile === "car-fast" ? "auto" : "bicycle",
    contours: [{ distance: serviceAreaConfig.maxDistanceKm }],
    polygons: true,
    // Uden disse to bliver omridset et tyndt "spindelvæv", der følger hver
    // eneste lille vej. De glatter formen ud, så den er til at aflæse.
    denoise: 0.5,
    generalize: 400,
  };

  try {
    const response = await fetch(VALHALLA_ISOCHRONE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const data = await response.json();
    return Array.isArray(data?.features) && data.features.length > 0 ? data : null;
  } catch {
    return null;
  }
}
