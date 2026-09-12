/**
 * RENGØRINGSPAKKER OG PRISER
 * ------------------------------------------------
 * Alt om dine pakker samles her ét sted: navn, pris, beskrivelse og
 * hvad der er inkluderet. Ret trygt i tal og tekster herunder – resten
 * af hjemmesiden opdateres automatisk.
 *
 * "popular: true" sætter mærkatet "Mest populær" på en pakke.
 * Der må kun være ÉN pakke med popular: true ad gangen.
 *
 * Vil du tilføje en tredje pakke igen, kopierer du blot en hel blok
 * { ... } og retter id, navn, pris og punkter.
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
    description: "Grundig rengøring af hele kabinen – den mest valgte pakke.",
    features: [
      "Grundig støvsugning",
      "Rengøring af måtter",
      "Aftørring af instrumentbræt",
      "Rengøring af plastoverflader",
      "Kopholdere og dørpaneler",
      "Tømning af affald",
      "Bagagerum",
    ],
    popular: true,
    ctaLabel: "Vælg denne pakke",
  },
  {
    id: "fresh-deep",
    name: "Fresh Deep",
    price: 319,
    priceSuffix: "kr.",
    duration: "Ca. 2–3 timer",
    blockMinutes: 180,
    description: "Den grundige totalrengøring til bilen, der fortjener ekstra fokus.",
    features: [
      "Alt fra Fresh Clean",
      "Ekstra grundig støvsugning",
      "Rengøring mellem sæder",
      "Grundigere rengøring af overflader",
      "Pletbehandling efter behov",
      "Ekstra fokus på detaljer",
    ],
    ctaLabel: "Vælg denne pakke",
  },
];
