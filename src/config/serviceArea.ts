/**
 * KØREOMRÅDE – HVEM MÅ BOOKE DIREKTE?
 * ------------------------------------------------
 * Kunder inden for "maxDistanceKm" fra dit udgangspunkt kan booke med
 * det samme. Ligger deres adresse længere væk, får de i stedet besked
 * om at skrive til dig og høre, om det alligevel kan lade sig gøre.
 *
 * VIGTIGT: Afstanden måles som den rute, du faktisk skal CYKLE – ikke i
 * fugleflugt. Et sted på den anden side af Limfjorden tæller altså den
 * lange vej rundt over broen. (Aabybro er f.eks. kun 14 km i fugleflugt,
 * men 32 km på cykel.)
 *
 * SÅDAN ÆNDRER DU OMRÅDET:
 * - Vil du køre længere ud? Sæt maxDistanceKm op (f.eks. 25).
 * - Er du flyttet? Ret koordinaterne herunder.
 * - Får du bil eller knallert? Skift routingProfile (se nedenfor).
 *
 * Koordinaterne er bevidst afrundet, så de peger på dit lokalområde og
 * ikke på din præcise bopæl (koden ligger offentligt på GitHub).
 * Du finder koordinater for et andet sted ved at søge på adressen på
 * https://api.dataforsyningen.dk/adresser?q=DIN+ADRESSE
 */

/** Måderne du kan komme frem på */
type RoutingProfile = "trekking" | "fastbike" | "car-fast";

export const serviceAreaConfig = {
  /** Længdegrad (x) for dit udgangspunkt */
  centerLongitude: 9.74,
  /** Breddegrad (y) for dit udgangspunkt */
  centerLatitude: 57.04,

  /** Hvor langt du kører ud, målt i kilometer ad cykelruten */
  maxDistanceKm: 15,

  /**
   * Hvordan du kommer frem:
   *   "trekking"  = almindelig cykel (bruger cykelstier)
   *   "fastbike"  = hurtig cykel/racer (holder sig mere til veje)
   *   "car-fast"  = bil
   */
  routingProfile: "trekking" as RoutingProfile,

  /** Her skal kunder uden for området skrive til */
  outOfAreaEmail: "mmgrevsen@gmail.com",

  /** Beskeden kunder uden for området får at se */
  outOfAreaMessage:
    "Din adresse ligger længere væk, end jeg normalt cykler ud til. Skriv til mig, så finder vi ud af, om det alligevel kan lade sig gøre.",
} as const;
