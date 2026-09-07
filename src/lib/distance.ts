import { serviceAreaConfig } from "@/config/serviceArea";

/**
 * AFSTANDSBEREGNING
 * ------------------------------------------------
 * Slår kundens adresse op i Danmarks officielle adresseregister (DAWA)
 * og regner ud, hvor langt der er hjem til dig i lige linje.
 * API'et er gratis og offentligt – der skal ikke oprettes en konto
 * eller bruges nøgler.
 */

const DAWA_BASE = "https://api.dataforsyningen.dk";

/** Afstand mellem to punkter på jorden, i kilometer. */
export function distanceInKm(
  [lon1, lat1]: [number, number],
  [lon2, lat2]: [number, number]
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

/** Koordinater for midten af et postnummer. */
async function lookupPostalCode(postalCode: string): Promise<[number, number] | null> {
  const response = await fetch(`${DAWA_BASE}/postnumre/${postalCode}`);
  if (!response.ok) return null;
  const data = await response.json();
  return Array.isArray(data.visueltcenter) ? data.visueltcenter : null;
}

/** Koordinater for en konkret adresse (mere præcist end postnummeret alene). */
async function lookupAddress(
  address: string,
  postalCode: string
): Promise<[number, number] | null> {
  const query = encodeURIComponent(`${address} ${postalCode}`.trim());
  const response = await fetch(
    `${DAWA_BASE}/adresser?q=${query}&postnr=${postalCode}&struktur=mini&per_side=1`
  );
  if (!response.ok) return null;

  const results = await response.json();
  const match = Array.isArray(results) ? results[0] : null;
  if (!match || typeof match.x !== "number" || typeof match.y !== "number") {
    return null;
  }
  return [match.x, match.y];
}

export type AreaCheck = {
  /** true hvis kunden må booke direkte */
  isInsideArea: boolean;
  /** Afstanden i km – null hvis adressen ikke kunne slås op */
  distanceKm: number | null;
};

/**
 * Tjekker om en adresse ligger inden for dit køreområde.
 * Kan adressen ikke slås op (f.eks. en tastefejl), betragtes den som
 * inden for området, så en kunde aldrig bliver afvist ved en fejl –
 * du kan altid selv sige fra, når du modtager forespørgslen.
 */
export async function checkServiceArea(
  address: string,
  postalCode: string
): Promise<AreaCheck> {
  const trimmedPostalCode = postalCode.trim();
  if (!/^\d{4}$/.test(trimmedPostalCode)) {
    return { isInsideArea: true, distanceKm: null };
  }

  try {
    const coordinates =
      (await lookupAddress(address, trimmedPostalCode)) ??
      (await lookupPostalCode(trimmedPostalCode));

    if (!coordinates) {
      return { isInsideArea: true, distanceKm: null };
    }

    const distanceKm = distanceInKm(
      [serviceAreaConfig.centerLongitude, serviceAreaConfig.centerLatitude],
      coordinates
    );

    return {
      isInsideArea: distanceKm <= serviceAreaConfig.maxDistanceKm,
      distanceKm: Math.round(distanceKm * 10) / 10,
    };
  } catch {
    return { isInsideArea: true, distanceKm: null };
  }
}
