/**
 * ADRESSE-OPSLAG (DAWA)
 * ------------------------------------------------
 * Bruger Danmarks officielle adresseregister til at:
 *  - foreslå adresser, mens kunden skriver
 *  - finde adressen ud fra et punkt på kortet
 *  - slå den valgte adresses præcise koordinater op
 *
 * API'et er gratis og offentligt – der skal hverken oprettes konto
 * eller bruges nøgler. Dokumentation: https://dawadocs.dataforsyningen.dk
 */

const DAWA_BASE = "https://api.dataforsyningen.dk";

export type DawaAddress = {
  /** DAWA's unikke id for adressen – bruges til at slå den op igen på serveren */
  id: string;
  /** Hele adressen som tekst, f.eks. "Vesterbro 12, 9000 Aalborg" */
  text: string;
  postalCode: string;
  longitude: number;
  latitude: number;
};

/** Forslag til adresser, mens kunden skriver. */
export async function searchAddresses(
  query: string,
  signal?: AbortSignal
): Promise<DawaAddress[]> {
  if (query.trim().length < 3) return [];

  const response = await fetch(
    `${DAWA_BASE}/adresser/autocomplete?q=${encodeURIComponent(query)}&per_side=6`,
    { signal }
  );
  if (!response.ok) return [];

  const results = await response.json();
  if (!Array.isArray(results)) return [];

  return results
    .map((entry): DawaAddress | null => {
      const address = entry?.adresse;
      if (!address || typeof address.x !== "number" || typeof address.y !== "number") {
        return null;
      }
      return {
        id: address.id,
        text: entry.tekst,
        postalCode: String(address.postnr ?? ""),
        longitude: address.x,
        latitude: address.y,
      };
    })
    .filter((address): address is DawaAddress => address !== null);
}

/** Finder den nærmeste adresse ud fra et punkt på kortet. */
export async function addressFromCoordinates(
  longitude: number,
  latitude: number
): Promise<DawaAddress | null> {
  const response = await fetch(
    `${DAWA_BASE}/adgangsadresser/reverse?x=${longitude}&y=${latitude}&struktur=mini`
  );
  if (!response.ok) return null;

  const data = await response.json();
  if (!data || typeof data.x !== "number" || typeof data.y !== "number") return null;

  return {
    id: data.id,
    text: `${data.vejnavn} ${data.husnr}, ${data.postnr} ${data.postnrnavn}`,
    postalCode: String(data.postnr ?? ""),
    longitude: data.x,
    latitude: data.y,
  };
}

/**
 * Slår en adresse op ud fra dens id. Bruges på serveren, så afstanden
 * bliver tjekket på en adresse, vi selv har hentet – og ikke på
 * koordinater, som browseren har sendt med.
 */
export async function addressById(id: string): Promise<DawaAddress | null> {
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) return null;

  const response = await fetch(`${DAWA_BASE}/adresser/${id}?struktur=mini`);
  if (!response.ok) return null;

  const data = await response.json();
  if (!data || typeof data.x !== "number" || typeof data.y !== "number") return null;

  return {
    id: data.id,
    text: `${data.vejnavn} ${data.husnr}, ${data.postnr} ${data.postnrnavn}`,
    postalCode: String(data.postnr ?? ""),
    longitude: data.x,
    latitude: data.y,
  };
}
