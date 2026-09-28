/**
 * RENGØRINGSPAKKER OG PRISER
 * ------------------------------------------------
 * Alt om dine pakker samles her ét sted: navn, pris, beskrivelse og
 * hvad der er inkluderet. Ret trygt i tal og tekster herunder – resten
 * af hjemmesiden opdateres automatisk.
 *
 * Der er ÉN pakke lige nu. Vil du have flere igen, kopierer du hele
 * blokken { ... } og retter id, navn, pris, tid og punkter.
 *
 * Har du flere pakker, kan du sætte "popular: true" på én af dem for
 * at give den mærkatet "Mest populær". Med kun én pakke giver det
 * ingen mening, så den er taget af.
 *
 * HUSK: "blockMinutes" styrer, hvor lang tid pakken optager i
 * kalenderen. Retter du tiden, så ret også den.
 */

export type PricingPackage = {
  id: string;
  name: string;
  price: number;
  priceSuffix: string;
  /** Cirka hvor lang tid pakken tager – vises på pakkekortet */
  duration: string;
  /**
   * Hvor mange minutter pakken optager i kalenderen. Bruges til at
   * regne ud, hvilke tider der er ledige. Sæt den til den LÆNGSTE tid,
   * pakken kan tage, så du ikke får to bookinger oven i hinanden.
   */
  blockMinutes: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
};

export const pricingPackages: PricingPackage[] = [
  {
    id: "fresh-clean",
    name: "Fresh Clean",
    price: 219,
    priceSuffix: "kr.",
    duration: "Ca. 1–1,5 time",
    blockMinutes: 90,
    description: "Grundig rengøring af hele kabinen indvendigt.",
    features: [
      "Grundig støvsugning",
      "Rengøring af måtter",
      "Aftørring af instrumentbræt",
      "Rengøring af plastoverflader",
      "Kopholdere og dørpaneler",
      "Tømning af affald",
      "Bagagerum",
    ],
    ctaLabel: "Vælg denne pakke",
  },
];
