/**
 * FØR & EFTER-BILLEDER
 * ------------------------------------------------
 * Billederne herunder er PLACEHOLDERS (tegnede illustrationer), så du
 * hurtigt kan se, hvordan sektionen fungerer.
 *
 * SÅDAN SKIFTER DU TIL DINE EGNE BILLEDER:
 * 1. Læg dit "før"-billede og "efter"-billede i mappen
 *    public/images/before-after/
 * 2. Ret "before" og "after" herunder, så de peger på dine filnavne,
 *    f.eks. "/images/before-after/saeder-foer.jpg"
 * 3. Gem filen – hjemmesiden opdateres automatisk.
 */

export type BeforeAfterItem = {
  id: string;
  title: string;
  before: string;
  after: string;
};

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: "saeder",
    title: "Sæder",
    before: "/images/before-after/saeder-foer.svg",
    after: "/images/before-after/saeder-efter.svg",
  },
  {
    id: "gulv",
    title: "Gulv",
    before: "/images/before-after/gulv-foer.svg",
    after: "/images/before-after/gulv-efter.svg",
  },
  {
    id: "kopholdere",
    title: "Kopholdere",
    before: "/images/before-after/kopholdere-foer.svg",
    after: "/images/before-after/kopholdere-efter.svg",
  },
  {
    id: "instrumentbraet",
    title: "Instrumentbræt",
    before: "/images/before-after/instrumentbraet-foer.svg",
    after: "/images/before-after/instrumentbraet-efter.svg",
  },
  {
    id: "bagagerum",
    title: "Bagagerum",
    before: "/images/before-after/bagagerum-foer.svg",
    after: "/images/before-after/bagagerum-efter.svg",
  },
];

/**
 * Hero-billedet øverst på forsiden.
 * Skift stien for at bruge dit eget billede af en ren bilkabine.
 */
export const heroImage = {
  src: "/images/hero-car-interior.svg",
  alt: "Illustration af en ren og frisk bilkabine",
};
