/**
 * RENGØRINGSPAKKER OG PRISER
 * ------------------------------------------------
 * Alt om dine pakker samles her ét sted: navn, pris, beskrivelse og
 * hvad der er inkluderet. Ret trygt i tal og tekster herunder – resten
 * af hjemmesiden opdateres automatisk.
 *
 * "popular: true" sætter mærkatet "Mest populær" på en pakke.
 * Der må kun være ÉN pakke med popular: true ad gangen.
 */

export type PricingPackage = {
  id: string;
  name: string;
  price: number;
  priceSuffix: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaLabel: string;
};

export const pricingPackages: PricingPackage[] = [
  {
    id: "fresh-basic",
    name: "Fresh Basic",
    price: 149,
    priceSuffix: "kr.",
    description: "Den hurtige opfriskning til bilen, der trænger til en let hånd.",
    features: [
      "Grundig støvsugning",
      "Rengøring af måtter",
      "Aftørring af instrumentbræt",
      "Tømning af affald",
      "Let rengøring af overflader",
    ],
    ctaLabel: "Vælg denne pakke",
  },
  {
    id: "fresh-clean",
    name: "Fresh Clean",
    price: 249,
    priceSuffix: "kr.",
    description: "Den mest valgte pakke – grundig rengøring af hele kabinen.",
    features: [
      "Alt fra Fresh Basic",
      "Grundig rengøring af plastoverflader",
      "Kopholdere",
      "Dørpaneler",
      "Indvendige ruder",
      "Bagagerum",
    ],
    popular: true,
    ctaLabel: "Vælg denne pakke",
  },
  {
    id: "fresh-deep",
    name: "Fresh Deep",
    price: 399,
    priceSuffix: "kr.",
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
