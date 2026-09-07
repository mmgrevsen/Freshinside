/**
 * KØREOMRÅDE – HVEM MÅ BOOKE DIREKTE?
 * ------------------------------------------------
 * Kunder inden for "maxDistanceKm" fra dit udgangspunkt kan booke med
 * det samme. Ligger deres adresse længere væk, får de i stedet besked
 * om at skrive til dig og høre, om det alligevel kan lade sig gøre.
 *
 * SÅDAN ÆNDRER DU OMRÅDET:
 * - Vil du køre længere ud? Sæt maxDistanceKm op (f.eks. 25).
 * - Er du flyttet? Ret koordinaterne herunder.
 *
 * Koordinaterne er bevidst afrundet, så de peger på dit lokalområde og
 * ikke på din præcise bopæl (koden ligger offentligt på GitHub).
 * Du finder koordinater for et andet sted ved at søge på adressen på
 * https://api.dataforsyningen.dk/adresser?q=DIN+ADRESSE
 */

export const serviceAreaConfig = {
  /** Længdegrad (x) for dit udgangspunkt */
  centerLongitude: 9.74,
  /** Breddegrad (y) for dit udgangspunkt */
  centerLatitude: 57.04,

  /** Hvor langt du kører ud, målt i kilometer i lige linje */
  maxDistanceKm: 15,

  /** Her skal kunder uden for området skrive til */
  outOfAreaEmail: "mmgrevsen@gmail.com",

  /** Beskeden kunder uden for området får at se */
  outOfAreaMessage:
    "Din adresse ligger uden for det område, jeg normalt kører ud til. Skriv til mig, så finder vi ud af, om det alligevel kan lade sig gøre.",
} as const;
