import { serviceAreaConfig } from "@/config/serviceArea";

/**
 * AFSTANDSBEREGNING
 * ------------------------------------------------
 * Afstanden måles som den rute, man rent faktisk kan cykle – ikke i
 * fugleflugt. Det betyder f.eks., at et sted på den anden side af
 * Limfjorden tæller den lange vej rundt over broen, sådan som du selv
 * skal køre.
 *
 * Ruten hentes fra BRouter, en gratis, offentlig cykelrute-tjeneste
 * bygget på OpenStreetMap. Der skal hverken oprettes konto eller
 * bruges nøgler.
 */

const BROUTER_URL = "https://brouter.de/brouter";
const DAWA_BASE = "https://api.dataforsyningen.dk";
const ROUTE_TIMEOUT_MS = 9000;

export type Coordinates = [longitude: number, latitude: number];

/** Fugleflugt mellem to punkter, i kilometer. */
export function distanceInKm(
  [lon1, lat1]: Coordinates,
  [lon2, lat2]: Coordinates
): number {
  const earthRadiusKm = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

/** Længden af den cykelrute, man skal køre. Null hvis ruten ikke kunne hentes. */
async function cyclingDistanceInKm(
  from: Coordinates,
  to: Coordinates
): Promise<number | null> {
  const url =
    `${BROUTER_URL}?lonlats=${from[0]},${from[1]}|${to[0]},${to[1]}` +
    `&profile=${serviceAreaConfig.routingProfile}&alternativeidx=0&format=geojson`;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(ROUTE_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const data = await response.json();
    const meters = Number(data?.features?.[0]?.properties?.["track-length"]);
    return Number.isFinite(meters) ? meters / 1000 : null;
  } catch {
    return null;
  }
}

export type AreaCheck = {
  /** true hvis kunden må booke direkte */
  isInsideArea: boolean;
  /** Afstanden i km – null hvis den slet ikke kunne beregnes */
  distanceKm: number | null;
  /** true hvis tallet er en rigtig cykelrute, false hvis det er fugleflugt */
  isCyclingRoute: boolean;
};

const center: Coordinates = [
  serviceAreaConfig.centerLongitude,
  serviceAreaConfig.centerLatitude,
];

/**
 * Måler afstanden hjem til dig og afgør, om kunden kan booke direkte.
 *
 * Fugleflugt bruges først som hurtigt filter: en cykelrute er altid
 * mindst lige så lang, så ligger fugleflugten allerede uden for
 * området, behøver vi ikke hente en rute.
 */
export async function measureDistanceToCustomer(
  destination: Coordinates
): Promise<AreaCheck> {
  const straightLineKm = distanceInKm(center, destination);

  if (straightLineKm > serviceAreaConfig.maxDistanceKm) {
    return {
      isInsideArea: false,
      distanceKm: Math.round(straightLineKm * 10) / 10,
      isCyclingRoute: false,
    };
  }

  const cyclingKm = await cyclingDistanceInKm(center, destination);

  // Kan ruten ikke hentes, afvises kunden ikke – så hellere tage imod
  // forespørgslen og selv sige fra, hvis det er for langt.
  if (cyclingKm === null) {
    return {
      isInsideArea: true,
      distanceKm: Math.round(straightLineKm * 10) / 10,
      isCyclingRoute: false,
    };
  }

  return {
    isInsideArea: cyclingKm <= serviceAreaConfig.maxDistanceKm,
    distanceKm: Math.round(cyclingKm * 10) / 10,
    isCyclingRoute: true,
  };
}

/** Koordinater for midten af et postnummer – bruges kun som nødløsning. */
async function lookupPostalCode(postalCode: string): Promise<Coordinates | null> {
  const response = await fetch(`${DAWA_BASE}/postnumre/${postalCode}`);
  if (!response.ok) return null;
  const data = await response.json();
  return Array.isArray(data.visueltcenter) ? data.visueltcenter : null;
}

/**
 * Nødløsning, hvis vi kun har adressen som tekst og ikke et adresse-id.
 * Kan adressen slet ikke findes, betragtes den som inden for området, så
 * en kunde aldrig bliver afvist på grund af en teknisk fejl.
 */
export async function checkServiceAreaByText(
  address: string,
  postalCode: string
): Promise<AreaCheck> {
  const trimmedPostalCode = postalCode.trim();
  if (!/^\d{4}$/.test(trimmedPostalCode)) {
    return { isInsideArea: true, distanceKm: null, isCyclingRoute: false };
  }

  try {
    const query = encodeURIComponent(`${address} ${trimmedPostalCode}`.trim());
    const response = await fetch(
      `${DAWA_BASE}/adresser?q=${query}&postnr=${trimmedPostalCode}&struktur=mini&per_side=1`
    );

    let coordinates: Coordinates | null = null;
    if (response.ok) {
      const results = await response.json();
      const match = Array.isArray(results) ? results[0] : null;
      if (match && typeof match.x === "number" && typeof match.y === "number") {
        coordinates = [match.x, match.y];
      }
    }

    coordinates ??= await lookupPostalCode(trimmedPostalCode);
    if (!coordinates) {
      return { isInsideArea: true, distanceKm: null, isCyclingRoute: false };
    }

    return measureDistanceToCustomer(coordinates);
  } catch {
    return { isInsideArea: true, distanceKm: null, isCyclingRoute: false };
  }
}
